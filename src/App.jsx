import { useState, useEffect } from "react";
import Camera from "./components/Camera";
import Login from "./components/Login";
import { setLogoutHandler } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // When the interceptor catches an unrecoverable 401, or logout is called, 
    // it triggers this handler to kick the user back to the login screen.
    setLogoutHandler(() => setIsAuthenticated(false));
  }, []);

  return (
    <div className="h-screen w-screen bg-[#f5efe6] text-slate-800 overflow-hidden font-sans p-4 md:p-6 flex flex-col">
      {isAuthenticated ? (
        <Camera onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;