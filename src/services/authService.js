import api from "./api";

/**
 * Ensures the CSRF cookie is set by the backend.
 * This is public and should not require an existing JWT.
 */
export const getCsrfToken = async () => {
    // Calling the GET /csrf/ endpoint causes Django to set a `csrftoken` cookie
    const response = await api.get("/csrf/");
    return response.data;
};

/**
 * Authenticates the user and sets HttpOnly JWT cookies.
 * 
 * @param {string} username 
 * @param {string} password 
 */
export const login = async (username, password) => {
    // Ensure we have a CSRF token before attempting an unsafe (POST) request
    await getCsrfToken();

    // Make the login request. The browser will automatically store the
    // resulting access_token and refresh_token HttpOnly cookies.
    const response = await api.post("/login/", {
        username,
        password,
    });

    return response.data;
};

// --- Logout and Event Management ---

let logoutHandler = null;

/**
 * Registers a callback to be called when the user logs out 
 * (either manually or due to an expired refresh token).
 */
export const setLogoutHandler = (callback) => {
    logoutHandler = callback;
};

/**
 * Triggers the registered logout handler.
 */
export const triggerLogout = () => {
    if (logoutHandler) {
        logoutHandler();
    }
};

/**
 * Logs the user out by asking the backend to blacklist the token 
 * and clear the cookies. Then triggers the frontend logout state.
 */
export const logout = async () => {
    try {
        await api.post("/logout/");
    } catch (error) {
        console.error("Logout API failed, but forcing frontend logout anyway", error);
    } finally {
        triggerLogout();
    }
};
