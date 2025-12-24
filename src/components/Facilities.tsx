import { useEffect, useRef } from "react";
import { Gamepad2, Monitor, Wifi, Coffee, Star, ArrowUpRight } from "lucide-react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import type { FacilityItem, BookingType } from "../types";
import { CARD_VISIBILITY_THRESHOLD, CARD_ANIMATION_DELAY_MS } from "../constants";

export default function Facilities() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const items: FacilityItem[] = [
    {
      title: "PlayStation 4",
      desc: "Nikmati ribuan game hits dengan performa stabil dan controller original yang responsif.",
      icon: <Gamepad2 size={24} className="text-blue-500" />,
      img: img1,
      type: "ps4" as BookingType,
    },
    {
      title: "PlayStation 5",
      desc: "Rasakan next-gen gaming 4K 60fps dengan loading super cepat dan haptic feedback.",
      icon: <Gamepad2 size={24} className="text-purple-500" />,
      img: img2,
      type: "ps5" as BookingType,
    },
    {
      title: "PC Gaming",
      desc: "RTX 40 Series, Monitor 240Hz, dan kursi gaming premium untuk pengalaman kompetitif.",
      icon: <Monitor size={24} className="text-cyan-500" />,
      img: img3,
      type: "warnet" as BookingType,
    },
  ];

  const handleBooking = (type: BookingType) => {
    // 1. Dispatch custom event for selection
    const event = new CustomEvent("select-rental", { detail: type });
    window.dispatchEvent(event);

    // 2. Smooth scroll to booking section
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add("card-visible");
        });
      },
      { threshold: CARD_VISIBILITY_THRESHOLD }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="fasilitas" className="px-6 md:px-12 lg:px-24">
      {/* HEADER SECTION */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm">
          <Star size={16} />
          <span>Fasilitas Bintang 5</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight pb-1">
          Arena Gaming Ultimate
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Kami menyediakan perangkat terbaik agar performa gaming kamu selalu maksimal.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="
              card-hidden-modern
              group relative
              flex flex-col
              bg-white/5
              backdrop-blur-xl
              rounded-[2rem]
              border border-white/10
              overflow-hidden
              transition-all duration-500 ease-out
              hover:-translate-y-2
              hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.2)]
            "
            style={{ transitionDelay: `${i * CARD_ANIMATION_DELAY_MS}ms` }}
          >
            {/* IMAGE CONTAINER */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white">
                {item.icon}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-600 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                {item.desc}
              </p>

              {/* FEATURES LIST (Static for now to show detail) */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 py-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Wifi size={14} /> <span>100Mbps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coffee size={14} /> <span>Snacks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight size={14} /> <span>AC Dingin</span>
                </div>
              </div>

              <button
                onClick={() => handleBooking(item.type!)}
                className="w-full py-4 rounded-xl font-bold bg-white/5 text-white group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Booking Unit Ini <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
