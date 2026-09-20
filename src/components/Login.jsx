import { useState } from "react";
import { login } from "../services/authService";
import handImage from "../assets/hand.jpg";

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(username, password);
            onLoginSuccess();
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid credentials or server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden p-4 md:p-8">
            {/* Subtle background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] w-full max-w-5xl relative z-10 flex flex-col md:flex-row overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] min-h-[600px]">
                
                {/* Left Panel: Login Form */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white/40">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-900 mb-2 drop-shadow-sm tracking-tight">
                            Hand Detection
                        </h1>
                        <h2 className="text-xl font-bold text-amber-950 tracking-tight mt-6">
                            Welcome Back
                        </h2>
                        <p className="text-amber-800/70 text-sm mt-1 font-medium">Please sign in to continue</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center animate-[pulse_1s_ease-in-out_1]">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm mx-auto w-full" autoComplete="off">
                        <div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-amber-900/10 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all shadow-sm font-medium placeholder-amber-900/30"
                                    placeholder="Username"
                                    required
                                    autoComplete="off"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/30 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                        </div>
                        
                        <div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-amber-900/10 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all shadow-sm font-medium placeholder-amber-900/30"
                                    placeholder="Password"
                                    required
                                    autoComplete="new-password"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/30 group-focus-within:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-amber-900/30 hover:text-amber-700 transition-colors rounded-lg focus:outline-none"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-amber-900/20 transition-all hover:shadow-amber-900/30 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:translate-y-0 disabled:hover:shadow-none mt-6 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                "Login Now"
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Panel: Decorative Theme with Image */}
                <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-900 relative items-center justify-center p-12 overflow-hidden">
                    {/* Abstract Decorative Shapes */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 border-[40px] border-amber-500/20 rounded-full blur-sm"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 border-[30px] border-amber-800/30 rounded-full blur-sm"></div>
                    
                    {/* Floating Accent Circle */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center animate-[bounce_4s_infinite]">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <img 
                            src={handImage} 
                            alt="Hand Detection Visualization" 
                            className="w-full max-w-sm rounded-3xl shadow-2xl object-cover object-center transform transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
