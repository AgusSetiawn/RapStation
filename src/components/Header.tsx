import React from "react";
import { Menu, X, Search } from "lucide-react";
import { useScrollDetect } from "../hooks";
import { NAV_ITEMS, SCROLL_THRESHOLD } from "../constants";

import logoImg from "../assets/logo.webp";

interface HeaderProps {
  onNavigate?: (id: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const isScrolled = useScrollDetect(SCROLL_THRESHOLD);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed left-1/2 top-1.5 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out animate-slideInDown pointer-events-auto ${isScrolled
        ? "w-[95%] md:w-3/4 lg:w-2/3 px-4 py-1.5 rounded-full bg-black/10 backdrop-blur-3xl backdrop-saturate-150 shadow-lg border border-white/10"
        : "w-full max-w-6xl px-6 py-3 bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => handleNavClick(e, "#home")}>
          <img
            src={logoImg}
            alt="RapsStation Logo"
            className="w-12 h-12 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
          />
          <div className="flex flex-col justify-center h-full">
            <span className={`text-2xl font-extrabold font-sans tracking-tight leading-none transition-colors duration-150 ${isScrolled
              ? "text-white group-hover:text-blue-500"
              : "text-white group-hover:text-blue-500"
              }`}>
              RapsStation
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center justify-center gap-10 text-lg font-bold col-start-2 transition-colors duration-150 ${isScrolled
          ? "text-gray-100"
          : "text-white"
          }`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative group py-2"
            >
              <span className="relative z-10 transition-colors duration-150 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                {item.label}
              </span>
              {/* Animated Underline */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all duration-300 ease-out group-hover:w-full group-hover:shadow-[0_0_10px_#60a5fa]" />

              {/* Subtle Top Glow */}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/50 transition-all duration-500 delay-100 group-hover:w-1/2 opacity-0 group-hover:opacity-100" />
            </a>
          ))}


        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 col-start-3">
          {/* Lacak Booking Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('tracking');
            }}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 transition-all duration-300 border border-white/10 group"
          >
            <Search size={16} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Lacak Booking</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            aria-label={menuOpen ? "Tutup Menu" : "Buka Menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
