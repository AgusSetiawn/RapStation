import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15; // Slightly faster for punchier feel
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden font-mono">
            {/* 1. Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.1)_1px,transparent_1px)] bg-[size:40px_40px] perspective-[1000px] pointer-events-none opacity-20" />

            {/* 2. Ambient Flares */}
            <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[150px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow animation-delay-2000" />

            {/* 3. The CYBER REACTOR Core */}
            <div className="relative z-10 flex flex-col items-center justify-center scale-150 mb-12">

                {/* Ring 1 - Outer Slow Rotate */}
                <div className="absolute w-40 h-40 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute w-40 h-40 border-t border-l border-red-500/50 rounded-full animate-[spin_10s_linear_infinite]" />

                {/* Ring 2 - Reverse Rotate Fast */}
                <div className="absolute w-32 h-32 border border-white/5 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                <div className="absolute w-32 h-32 border-b-2 border-r-2 border-cyan-400/80 rounded-full animate-[spin_5s_linear_infinite_reverse]" />

                {/* Ring 3 - Inner Pulse Ring */}
                <div className="absolute w-20 h-20 border-2 border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />

                {/* CORE - Pulsing Heart */}
                <div className="relative w-12 h-12 bg-red-600 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full blur-sm" />
                </div>

                {/* Holo Glitch Effect */}
                <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse" />
            </div>

            {/* 4. Text & Progress */}
            <div className="relative z-10 flex flex-col items-center tracking-widest">
                <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    ACCESSING CORE
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </h2>

                {/* Cyber Progress Bar */}
                <div className="w-80 h-2 bg-neutral-900 border border-white/20 rounded-none overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,1)]">
                    <div
                        className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] relative"
                        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    >
                        {/* Scanline in bar */}
                        <div className="absolute inset-0 bg-white/40 w-full animate-[shimmer_0.5s_infinite]" />
                    </div>
                </div>

                {/* Status Text */}
                <p className="mt-3 text-xs text-cyan-400/80 font-mono animate-pulse">
                    &gt; Info min Loginkan_
                </p>
            </div>
        </div>
    );
}
