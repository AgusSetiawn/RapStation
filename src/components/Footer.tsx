import { useRef, useEffect } from "react";
import { Github, Instagram, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("card-visible");
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative mt-32 border-t border-white/10 overflow-hidden card-hidden-modern"
        >
            {/* Background with Glassmorphism */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl z-0" />

            {/* Enhanced Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 pointer-events-none animate-pulse-slow delay-1000" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                RapsStation
                            </h3>
                            <p className="mt-4 text-gray-400 leading-relaxed">
                                Experience gaming at its finest. Fasilitas premium, layanan 24/7, dan komunitas yang solid.
                            </p>
                        </div>
                        {/* Social Icons with Strong Glow */}
                        <div className="flex items-center gap-4">
                            {[
                                {
                                    icon: <Instagram size={20} />,
                                    href: "#",
                                    color: "hover:text-pink-500",
                                    glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:border-pink-500/50 hover:bg-pink-500/10"
                                },
                                {
                                    icon: <Twitter size={20} />,
                                    href: "#",
                                    color: "hover:text-sky-400",
                                    glow: "hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:border-sky-400/50 hover:bg-sky-400/10"
                                },
                                {
                                    icon: <Linkedin size={20} />,
                                    href: "#",
                                    color: "hover:text-blue-600",
                                    glow: "hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:border-blue-600/50 hover:bg-blue-600/10"
                                },
                                {
                                    icon: <Github size={20} />,
                                    href: "#",
                                    color: "hover:text-white",
                                    glow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:border-white/50 hover:bg-white/10"
                                },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 hover:scale-110 ${social.color} ${social.glow}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links with Text Glow */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Navigasi</h4>
                        <ul className="space-y-4">
                            {["Home", "Booking", "Fasilitas", "About"].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_#3b82f6]" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Bantuan</h4>
                        <ul className="space-y-4">
                            {["FAQ", "Syarat & Ketentuan", "Kebijakan Privasi", "Hubungi Kami"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-all duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Lokasi</h4>
                        <div className="space-y-4 text-gray-400">
                            <p>Jl. Gaming Street No. 123,<br />Jakarta Selatan, 12345</p>
                            <p className="text-white font-medium hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all cursor-pointer">info@rapsstation.com</p>
                            <p className="text-white font-medium hover:text-green-400 hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] transition-all cursor-pointer">+62 812-3456-7890</p>
                        </div>
                    </div>
                </div>

                {/* Improved Bottom Copyright Section */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm group">
                    <p className="text-gray-500 group-hover:text-gray-400 transition-colors">
                        &copy; {currentYear} <span className="text-blue-400 font-semibold drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]">RapsStation</span>. All rights reserved.
                    </p>

                    <div className="flex items-center gap-1 text-gray-500 group-hover:text-gray-400 transition-colors">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        <span>by Creative Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
