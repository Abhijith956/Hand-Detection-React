import { useState } from "react";
import { login } from "../services/authService";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafaf9] px-4 py-8 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[520px] h-[520px]
                bg-amber-500/[0.08]
                rounded-full blur-[110px]
                pointer-events-none"
            />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[480px]">

                <div className="
                    bg-white
                    border border-stone-200/80
                    rounded-[28px]
                    px-7 py-9
                    sm:px-10 sm:py-11
                    shadow-[0_12px_45px_rgba(0,0,0,0.06)]
                    transition-all duration-300
                    hover:shadow-[0_20px_60px_rgba(0,0,0,0.09)]
                ">

                    {/* Header */}
                    <div className="text-center mb-9">

                        <h1 className="
                            text-3xl sm:text-[38px]
                            font-extrabold
                            tracking-[-0.03em]
                            text-transparent
                            bg-clip-text
                            bg-gradient-to-r
                            from-amber-600
                            via-orange-600
                            to-amber-800
                        ">
                            Hand Detection
                        </h1>

                        <h2 className="
                            mt-5
                            text-xl
                            font-bold
                            tracking-tight
                            text-stone-900
                        ">
                            Welcome Back
                        </h2>

                        <p className="
                            mt-1.5
                            text-sm
                            text-stone-500
                        ">
                            Please sign in to continue
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="
                            mb-6
                            flex items-center gap-2.5
                            rounded-xl
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm
                            text-red-600
                        ">
                            <svg
                                className="w-5 h-5 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                        autoComplete="off"
                    >

                        {/* Username */}
                        <div>
                            <label className="
                                block
                                mb-2
                                text-sm
                                font-semibold
                                text-stone-700
                            ">
                                Username
                            </label>

                            <div className="relative group">

                                <User className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    w-[18px]
                                    h-[18px]
                                    text-stone-400
                                    transition-colors
                                    group-focus-within:text-amber-600
                                " />

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="off"
                                    className="
                                        w-full
                                        h-12
                                        pl-11
                                        pr-4
                                        rounded-xl
                                        border border-stone-300
                                        bg-stone-50/50
                                        text-sm
                                        font-medium
                                        text-stone-900
                                        placeholder:text-stone-400

                                        outline-none

                                        transition-all

                                        focus:bg-white
                                        focus:border-amber-500
                                        focus:ring-4
                                        focus:ring-amber-500/10

                                        hover:border-stone-400
                                    "
                                />

                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="
                                block
                                mb-2
                                text-sm
                                font-semibold
                                text-stone-700
                            ">
                                Password
                            </label>

                            <div className="relative group">

                                <Lock className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    w-[18px]
                                    h-[18px]
                                    text-stone-400
                                    transition-colors
                                    group-focus-within:text-amber-600
                                " />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="off"
                                    className="
                                        w-full
                                        h-12
                                        pl-11
                                        pr-12
                                        rounded-xl
                                        border border-stone-300
                                        bg-stone-50/50
                                        text-sm
                                        font-medium
                                        text-stone-900
                                        placeholder:text-stone-400

                                        outline-none

                                        transition-all

                                        focus:bg-white
                                        focus:border-amber-500
                                        focus:ring-4
                                        focus:ring-amber-500/10

                                        hover:border-stone-400
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        p-1.5
                                        rounded-lg
                                        text-stone-400
                                        hover:text-stone-700
                                        hover:bg-stone-100
                                        transition-colors
                                        focus:outline-none
                                    "
                                    title={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-[18px] h-[18px]" />
                                    ) : (
                                        <Eye className="w-[18px] h-[18px]" />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-2
                                w-full
                                h-12
                                flex
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                bg-gradient-to-r
                                from-amber-600
                                to-orange-600

                                text-white
                                text-sm
                                font-bold

                                shadow-[0_8px_20px_rgba(217,119,6,0.20)]

                                transition-all
                                duration-200

                                hover:from-amber-500
                                hover:to-orange-500
                                hover:shadow-[0_10px_25px_rgba(217,119,6,0.28)]

                                active:scale-[0.98]

                                disabled:opacity-70
                                disabled:cursor-not-allowed
                                disabled:active:scale-100
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </form>

                </div>

            </div>
        </div>
    );
}

export default Login;