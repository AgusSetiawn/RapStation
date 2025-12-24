import { ArrowRight, Lock, User, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useMemo } from "react";

interface AdminLoginProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

export default function AdminLogin({ onBack, onLoginSuccess }: AdminLoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isBlinking, setIsBlinking] = useState(false);

    // 3D Tilt State
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    // Generate stars only ONCE to prevent re-roll on every mouse move
    const stars = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            width: Math.random() * 3 + 2 + 'px',
            height: Math.random() * 3 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: -10 + '%',
            opacity: Math.random() * 0.5 + 0.3,
            animationDelay: Math.random() * 5 + 's',
            animationDuration: Math.random() * 10 + 10 + 's'
        }));
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateXVal = ((y - centerY) / centerY) * -10;
        const rotateYVal = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXVal);
        setRotateY(rotateYVal);
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setGlowPos({ x: 50, y: 50 });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            if (username === "admin" && password === "admin123") {
                onLoginSuccess();
            } else {
                setError("Username atau Password salah!");
                setIsLoading(false);
            }
        }, 1500);
    };

    const togglePassword = () => {
        setIsBlinking(true);
        setShowPassword(!showPassword);
        setTimeout(() => setIsBlinking(false), 300);
    };

    return (
        <div key="admin-login" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-neutral-900">

            {/* 1. COMPLETELY STATIC Background Layers */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                {/* Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-blob mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-red-600/30 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />

                {/* Static Snow/Star Effect */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full animate-star-fall"
                        style={{
                            width: star.width,
                            height: star.height,
                            left: star.left,
                            top: star.top,
                            opacity: star.opacity,
                            animationDelay: star.animationDelay,
                            animationDuration: star.animationDuration
                        }}
                    />
                ))}
            </div>

            {/* 2. 3D Tilt Card Container */}
            <div
                className="relative z-10 w-full max-w-md p-6"
                style={{ perspective: '1000px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={cardRef}
                    className="relative rounded-[2.5rem] transition-transform duration-100 ease-out"
                    style={{
                        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                    }}
                >
                    {/* SVG Dual Chasing Border Beam (Cyberpunk Style) with GLOW 
                        FIX: Removed clipped overflow so the glow can spill out 
                    */}
                    <div className="absolute -inset-[10px] z-0 pointer-events-none rounded-[3rem]"> {/* Expanded inset to -10px and removed overflow-hidden */}
                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="neonGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ff00ff" />
                                    <stop offset="100%" stopColor="#00ffff" />
                                </linearGradient>
                                <linearGradient id="neonGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ffff00" />
                                    <stop offset="100%" stopColor="#00ff00" />
                                </linearGradient>
                            </defs>

                            {/* Beam 1 with NEON GLOW */}
                            <rect
                                rx="48" ry="48" x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)"
                                fill="none"
                                stroke="url(#neonGradient1)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="drop-shadow-neon-1"
                            >
                                <animate
                                    attributeName="stroke-dasharray"
                                    values="0, 2000; 300, 2000; 0, 2000"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-dashoffset"
                                    values="0; -1000; -2000"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                            </rect>

                            {/* Beam 2 with NEON GLOW */}
                            <rect
                                rx="48" ry="48" x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)"
                                fill="none"
                                stroke="url(#neonGradient2)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="drop-shadow-neon-2"
                                style={{ opacity: 0.8 }}
                            >
                                <animate
                                    attributeName="stroke-dasharray"
                                    values="0, 2000; 300, 2000; 0, 2000"
                                    dur="4s"
                                    begin="1s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-dashoffset"
                                    values="-1000; -2000; -3000"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                            </rect>
                        </svg>
                    </div>

                    {/* Main Card Content */}
                    <div className="relative z-10 bg-neutral-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-8 md:p-10 flex flex-col items-center">

                        {/* Dynamic Spotlight */}
                        <div
                            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
                            style={{
                                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.05) 0%, transparent 60%)`
                            }}
                        />

                        {/* Top Decor */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* SHIELD ICON - Breathing/Pulse Animation */}
                        <div className="mb-6 bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-3xl border border-white/10 shadow-lg relative z-10 ring-1 ring-white/20 shadow-red-500/20 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <div className="relative animate-shield-pulse">
                                <ShieldAlert size={40} className="text-red-500 drop-shadow-lg group-hover:rotate-12 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full -z-10 animate-pulse" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 relative z-10 tracking-tight">Admin Portal</h2>
                        <p className="text-gray-400 mb-8 text-sm relative z-10 font-medium">Secure Access Dashboard</p>

                        <form onSubmit={handleLogin} className="w-full relative z-10 space-y-6">

                            {/* USERNAME INPUT - Wiggle Icon on Hover */}
                            <div className="space-y-1.5 text-left group/input">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 transition-colors group-hover/input:text-red-400">Username</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-white pointer-events-none">
                                        <User size={18} className="group-hover/input:text-red-400 group-hover/input:animate-pulse transition-all duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all text-white placeholder-gray-600 focus:bg-black/60"
                                        placeholder="Enter your id"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD INPUT - Shake Lock & Blink Eye */}
                            <div className="space-y-1.5 text-left group/input">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 transition-colors group-hover/input:text-red-400">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within/input:text-white pointer-events-none">
                                        <Lock size={18} className="group-hover/input:text-red-400 group-hover/input:animate-bounce transition-all duration-300" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-11 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 outline-none transition-all text-white placeholder-gray-600 focus:bg-black/60"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <div className={isBlinking ? "animate-blink" : ""}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm font-medium animate-shake flex items-center justify-center gap-2">
                                    <ShieldAlert size={16} /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-[-15deg] group-hover/btn:animate-shimmer transition-transform" />
                                        Access Dashboard <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        <button
                            onClick={onBack}
                            className="mt-8 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100"
                        >
                            <ArrowRight size={14} className="rotate-180" /> Back to Tracking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
