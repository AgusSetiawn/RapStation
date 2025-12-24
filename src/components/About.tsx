import { useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Trophy, Users, ChevronLeft, ChevronRight } from "lucide-react";

export default function About() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);

    // Data - Duplicated for infinite loop effect
    const originalReviews = [
        { name: "Andi R.", text: "Best rental in town! 🔥", color: "bg-blue-600" },
        { name: "Siti M.", text: "Tempatnya cozy banget ✨", color: "bg-purple-600" },
        { name: "Budi S.", text: "Internet ngebut parah 🚀", color: "bg-green-600" },
        { name: "Dewi K.", text: "Admin ramah & helpful 🎧", color: "bg-pink-600" },
        { name: "Reza P.", text: "Harga pelajar banget ⭐", color: "bg-orange-600" },
        { name: "Fajar G.", text: "Mabar spot favorit! 🏆", color: "bg-cyan-600" },
        { name: "Lina T.", text: "Game-nya update terus 🎮", color: "bg-teal-600" },
        { name: "Toni H.", text: "Snack-nya murah meriah 🍟", color: "bg-red-600" },
    ];
    // Create 3 sets for smooth infinite scrolling
    const reviews = [...originalReviews, ...originalReviews, ...originalReviews];

    const scroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            sliderRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Smooth Continuous Auto-scroll (Ticker)
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const autoScrollSpeed = 1.0; // Optimized speed for visibility

        const animate = () => {
            if (slider.matches(':hover')) {
                // Pause on hover
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            // Continuous scroll movement
            slider.scrollLeft += autoScrollSpeed;

            // Infinite Loop Reset Logic
            const oneThird = slider.scrollWidth / 3;

            // Loop check
            if (slider.scrollLeft >= oneThird * 2) {
                slider.scrollLeft = oneThird;
            }
            else if (slider.scrollLeft <= 10) {
                slider.scrollLeft = oneThird;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        const initScroll = () => {
            if (slider && slider.scrollWidth > 0) {
                slider.scrollLeft = slider.scrollWidth / 3;
            }
        };

        setTimeout(initScroll, 100);

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("card-visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative py-24 px-6 md:px-12 lg:px-24 card-hidden-modern scroll-mt-24 min-h-[80vh] flex flex-col justify-center"
        >
            {/* Ambient Background REMOVED to blend seamlessly with global background */}

            <div className="max-w-[1400px] mx-auto relative z-10 w-full">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm backdrop-blur-sm">
                        <Users size={16} />
                        <span>Kenalan Yuk!</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight pb-1">
                        Tentang RapsStation
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                        Destinasi gaming premium pilihan gamers profesional dan komunitas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* LEFT COLUMN: Story & Stats */}
                    <div className="flex flex-col gap-8 h-full">
                        {/* Main Description Card */}
                        <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                                <Trophy className="text-yellow-500" /> Visi Kami
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                RapsStation hadir untuk merevolusi pengalaman rental gaming. Kami tidak hanya menyewakan konsol, tapi memberikan <strong>ekosistem kompetitif</strong> dengan perangkat standar turnamen internasional.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 font-medium text-sm border border-blue-500/20">
                                    Official PS5 Controllers
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-300 font-medium text-sm border border-purple-500/20">
                                    RTX 40 Series
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-300 font-medium text-sm border border-green-500/20">
                                    Gigabit Ethernet
                                </div>
                            </div>
                        </div>

                        {/* Interactive Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all duration-300">
                                <div className="text-3xl font-bold text-white group-hover:text-white mb-1">500+</div>
                                <div className="text-sm text-gray-400 group-hover:text-blue-100">Happy Gamers</div>
                            </div>
                            <div className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-600 hover:border-purple-500 transition-all duration-300">
                                <div className="text-3xl font-bold text-white group-hover:text-white mb-1">24/7</div>
                                <div className="text-sm text-gray-400 group-hover:text-purple-100">Support System</div>
                            </div>
                        </div>

                        {/* Scrolling Testimonials - Auto-scroll + Manual */}
                        <div className="overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 p-6 relative flex flex-col justify-center min-h-[220px] flex-grow group/container">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                    </span>
                                    Words from the Community
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => scroll("left")}
                                        className="p-1.5 rounded-full bg-white/50 dark:bg-white/10 hover:bg-blue-600 hover:text-white transition-colors shadow-sm cursor-pointer z-20"
                                        aria-label="Scroll Left"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => scroll("right")}
                                        className="p-1.5 rounded-full bg-white/50 dark:bg-white/10 hover:bg-blue-600 hover:text-white transition-colors shadow-sm cursor-pointer z-20"
                                        aria-label="Scroll Right"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Clean Fade Masks (CSS Mask) - No black bars */}
                                <div
                                    ref={sliderRef}
                                    className="flex gap-4 overflow-x-auto pb-4 select-none no-scrollbar"
                                    style={{
                                        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                                        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none'
                                    }}
                                >
                                    {reviews.map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 w-60 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 group/card"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-8 h-8 rounded-full ${review.color} flex items-center justify-center text-xs text-white font-bold shadow-inner`}>
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-100">{review.name}</span>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="text-yellow-400 text-[8px] fill-current">★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 italic line-clamp-2 leading-relaxed">
                                                "{review.text}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Contact & Hours - NOW FLEX STRETCHED */}
                    <div className="flex flex-col gap-6 h-full">
                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform text-blue-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">Lokasi Utama</h4>
                                    <p className="text-lg font-bold text-white group-hover:text-blue-600 group-hover:text-blue-400 transition-colors">Jl. Gaming Street No. 123, JKT</p>
                                </div>
                            </a>

                            <a href="#" className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform text-green-400">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">Hotline / WA</h4>
                                    <p className="text-lg font-bold text-white group-hover:text-green-600 group-hover:text-green-400 transition-colors">+62 812-3456-7890</p>
                                </div>
                            </a>

                            <a href="#" className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform text-pink-400">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400">Email</h4>
                                    <p className="text-lg font-bold text-white group-hover:text-pink-600 group-hover:text-pink-400 transition-colors">info@rapsstation.com</p>
                                </div>
                            </a>
                        </div>

                        {/* Operating Hours Box - FLEX GROW TO MATCH LEFT COLUMN */}
                        <div className="relative p-8 rounded-[2rem] overflow-hidden group flex-grow flex flex-col justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90 transition-opacity group-hover:opacity-100" />
                            <div className="relative z-10 text-white w-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <Clock size={28} className="text-blue-200" />
                                    <h3 className="text-2xl font-bold">Jam Operasional</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                        <span className="text-blue-100">Senin - Jumat</span>
                                        <span className="font-bold font-mono">14:00 - 23:00</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                                        <span className="text-blue-100">Sabtu - Minggu</span>
                                        <span className="font-bold font-mono text-yellow-300">10:00 - 00:00</span>
                                    </div>
                                    <div className="mt-4 pt-2 text-sm text-center text-blue-200 bg-black/20 rounded-lg py-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                                        Buka Sekarang
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}