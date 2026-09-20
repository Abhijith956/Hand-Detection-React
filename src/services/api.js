import axios from "axios";

// Helper function to get cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
    withCredentials: true,
});

// Add a request interceptor to attach the CSRF token for unsafe requests
api.interceptors.request.use(
    (config) => {
        const method = config.method.toLowerCase();
        // Attach CSRF token only for state-changing methods
        if (["post", "put", "patch", "delete"].includes(method)) {
            const csrfToken = getCookie("csrftoken");
            if (csrfToken) {
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Refresh Token Logic ---

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

const onRefreshFailed = () => {
    refreshSubscribers.forEach((callback) => callback(new Error("Refresh failed")));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Add a response interceptor to handle 401s and token refreshing
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is not 401, or if it has already been retried, or if it's the refresh/login route itself, reject immediately
        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url.includes("/token/refresh/") ||
            originalRequest.url.includes("/login/") ||
            originalRequest.url.includes("/logout/")
        ) {
            return Promise.reject(error);
        }

        // Mark the request as retried so we don't loop
        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                // Attempt to refresh the token. 
                // The browser sends the HttpOnly refresh_token cookie automatically.
                await api.post("/token/refresh/");
                
                isRefreshing = false;
                onRefreshed();
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                onRefreshFailed();
                
                // Trigger frontend logout since refresh failed
                import("./authService").then(module => {
                    module.triggerLogout();
                });
                
                return Promise.reject(refreshError);
            }
        }

        // If a refresh is already in progress, wait for it to finish then retry
        return new Promise((resolve, reject) => {
            addRefreshSubscriber((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(api(originalRequest));
                }
            });
        });
    }
);

export default api;