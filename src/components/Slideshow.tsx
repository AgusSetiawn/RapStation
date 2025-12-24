import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const slides = [
  {
    img: img1,
    title: "Level Up Your Gaming",
    subtitle: "Nikmati pengalaman bermain PS4, PS5 & PC High-End terbaik.",
  },
  {
    img: img2,
    title: "Next-Gen Console",
    subtitle: "Rasakan performa maksimal dengan PlayStation 5 terbaru.",
  },
  {
    img: img3,
    title: "Ultimate PC Arena",
    subtitle: "RTX On. FPS Stabil. Gaming tanpa kompromi.",
  },
];

export default function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isAnimatingRef = useRef(false);

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => { isAnimatingRef.current = false; }, 800);
  };

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => { isAnimatingRef.current = false; }, 800);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // 4 seconds ideal
    return () => clearInterval(interval);
  }, [currentSlide]);



  return (
    <div id="home" className="relative h-screen w-full mx-auto overflow-hidden rounded-[2.5rem] shadow-2xl">
      {/* Background Layer - Stable (No Parallax) */}
      <div className="absolute inset-0 w-full h-full text-white">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out
              ${index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"}
            `}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-[#050510]/30 mix-blend-multiply" />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="max-w-4xl w-full text-center">
          {/* Animated Title */}
          <div className="overflow-hidden py-2 mb-4">
            <h1 key={currentSlide} className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl animate-fadeInUp tracking-tight">
              {slides[currentSlide].title}
            </h1>
          </div>

          {/* Subtitle */}
          <p key={currentSlide + "-sub"} className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed animate-fadeInUp stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Button - Elegant Style */}
          <div className="animate-fadeInUp stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <a
              href="#booking"
              className="
                group relative inline-flex items-center gap-3 px-8 py-4 
                bg-white/10 hover:bg-blue-600/20 
                backdrop-blur-xl border border-white/30 hover:border-blue-400/50 rounded-full
                text-white font-medium text-lg transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]
              "
            >
              <Gamepad2 className="group-hover:rotate-12 transition-transform text-white group-hover:text-blue-200" />
              <span>Mulai Main Sekarang</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-16 pointer-events-none">

        {/* Pagination Dots */}
        <div className="flex gap-4 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                h-1.5 rounded-full transition-all duration-500 
                ${index === currentSlide ? "w-12 bg-blue-500 shadow-[0_0_10px_#3b82f6]" : "w-3 bg-gray-500/50 hover:bg-gray-400"}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95 group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95 group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
