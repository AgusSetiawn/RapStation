import React, { useState, useEffect, useRef } from "react";
import { Calendar, Gamepad2, User, CheckCircle, AlertCircle, ArrowRight, Star, ShieldCheck, Clock, ChevronDown, Check, Monitor, CreditCard } from "lucide-react";
import { supabase } from "../lib/supabase";
import { encryptDES } from "../utils/crypto";
import type { BookingFormData, BookingType } from "../types";
import { BOOKING_OPTIONS } from "../constants";
import { validateBookingForm, formatBookingData } from "../utils";

interface BookingFormProps {
  onSuccess: (data: BookingFormData) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    bookingType: "",
    date: "",
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState(""); // Store generated code
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Scroll Reveal State
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Listen for external rental selection events
  useEffect(() => {
    const handleRentalSelection = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setFormData((prev) => ({ ...prev, bookingType: customEvent.detail }));
      }
    };

    window.addEventListener("select-rental", handleRentalSelection);
    return () => window.removeEventListener("select-rental", handleRentalSelection);
  }, []);

  const getRentalIcon = (type: string) => {
    switch (type) {
      case "ps4": return <Gamepad2 className="text-blue-500" size={20} />;
      case "ps5": return <Gamepad2 className="text-purple-500" size={20} />;
      case "warnet": return <Monitor className="text-cyan-500" size={20} />;
      default: return <Gamepad2 className="text-gray-400" size={20} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitSuccess(false);

    const validation = validateBookingForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate Booking Code (e.g., BK-7X9)
      const code = `BK-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      // 2. Encrypt Data
      const encryptedName = encryptDES(formData.name);

      // 3. Insert into Supabase
      const { data, error } = await supabase.from("bookings").insert({
        booking_code: code,
        name_encrypted: encryptedName,
        unit_type: BOOKING_OPTIONS.find(opt => opt.value === formData.bookingType)?.label || formData.bookingType,
        time_slot: "UNSELECTED",
        status: "BOOKED",
        date: formData.date,
        phone: encryptDES(formData.phone) // Encrypt phone before insert
      }).select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Insert berhasil tapi data tidak dikembalikan. Kemungkinan RLS memblokir insert.");
      }

      setBookingCode(code);

      // 4. Simulate delay for UX
      setTimeout(() => {
        const formattedData = formatBookingData(formData);
        if (import.meta.env.DEV) {
          console.log("📋 Booking Data Submitted:", formattedData);
        }

        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1000);

    } catch (err) {
      console.error("Booking failed:", err);
      setIsSubmitting(false);
      setErrors({ name: `Gagal menyimpan booking. Error: ${err instanceof Error ? err.message : "Network Error"}` });
      alert(`Booking Gagal: ${err instanceof Error ? err.message : "Terjadi kesalahan sistem."}`);
    }
  };

  return (
    <div
      id="booking"
      ref={sectionRef}
      className={`
        relative scroll-mt-24 min-h-screen flex flex-col items-center justify-center -mt-10 mx-auto w-[96%] sm:w-[94%] md:w-[90%] lg:w-[85%] max-w-[1200px] 
        transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}
    >
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-sm backdrop-blur-sm">
          <Calendar size={16} />
          <span>Booking Mudah & Cepat</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-500 bg-clip-text text-transparent">
          Reservasi Tempat
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
          Amankan jadwal bermainmu sekarang sebelum kehabisan slot.
        </p>
      </div>

      <div className="relative overflow-hidden bg-white dark:bg-black/40 backdrop-blur-3xl rounded-3xl border border-gray-200 dark:border-white/20 shadow-2xl flex flex-col lg:flex-row w-full">

        {/* === LEFT PANEL: INFO & MOTIVATION === */}
        <div className="w-full lg:w-2/5 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          {/* Dynamic Background for Left Panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-800/90 dark:from-blue-900/90 dark:to-indigo-950/90"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Siap Bermain?
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Booking tempatmu sekarang dan rasakan pengalaman gaming next-level tanpa antri.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <ShieldCheck size={24} className="text-blue-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Pembayaran Aman</h4>
                  <p className="text-sm text-blue-200">Transaksi terjamin aman & transparan.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <Star size={24} className="text-yellow-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Kualitas Premium</h4>
                  <p className="text-sm text-blue-200">Perangkat & fasilitas terbaik dikelasnya.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <Clock size={24} className="text-cyan-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Instant Booking</h4>
                  <p className="text-sm text-blue-200">Konfirmasi otomatis dalam hitungan detik.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-200 font-medium">✨ Lebih dari 500+ gamers puas bulan ini.</p>
          </div>
        </div>

        {/* === RIGHT PANEL: FORM === */}
        <div className="w-full lg:w-3/5 p-8 md:p-12 relative bg-white dark:bg-white/5 backdrop-blur-sm">
          {/* Success Overlay */}
          {submitSuccess && (
            <div className="absolute inset-0 z-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-scaleIn">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <CheckCircle className="text-green-600 dark:text-green-400 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Berhasil!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Terima kasih <span className="font-semibold text-gray-900 dark:text-white">{formData.name}</span>, jadwalmu sudah kami kunci.</p>
              <div className="mb-8 p-4 bg-blue-50 dark:bg-white/5 rounded-xl border border-dashed border-blue-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Kode Booking</p>
                <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest">{bookingCode}</p>
              </div>

              <div className="flex flex-col w-full max-w-sm gap-3">
                <button
                  onClick={() => onSuccess({ ...formData, bookingCode })}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  <CreditCard size={20} />
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#f5f5f5] text-white mb-1">Form Reservasi</h3>
            <p className="text-sm text-[#d4d4d4] text-gray-400">Lengkapi data diri untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Type Selection */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#d4d4d4] text-gray-300">
                  tipe rental
                </label>
                <div className="relative">
                  {/* Custom Dropdown Trigger */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                      w-full pl-4 pr-4 py-3.5 bg-white dark:bg-white/5 border backdrop-blur-md rounded-xl 
                      flex items-center justify-between cursor-pointer transition-all hover:border-blue-500/50
                      ${errors.bookingType ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-white/10"}
                      ${isDropdownOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {formData.bookingType ? (
                        getRentalIcon(formData.bookingType)
                      ) : (
                        <Gamepad2 className="text-[#a3a3a3] text-gray-400" size={20} />
                      )}
                      <span className={`font-medium ${formData.bookingType ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                        {BOOKING_OPTIONS.find(opt => opt.value === formData.bookingType)?.label || "Pilih Jenis Rental"}
                      </span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-blue-500" : ""}`} />
                  </div>

                  {/* Backdrop for clicking outside */}
                  {isDropdownOpen && (
                    <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsDropdownOpen(false)} />
                  )}

                  {/* Dropdown Options */}
                  <div
                    className={`
                      absolute top-full left-0 right-0 mt-2 p-1.5 
                      bg-white dark:bg-neutral-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 
                      rounded-xl shadow-2xl z-20 
                      origin-top transition-all duration-200 ease-out
                      ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                    `}
                  >
                    {BOOKING_OPTIONS.filter(opt => opt.value !== "").map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setFormData({ ...formData, bookingType: opt.value as BookingType });
                          setIsDropdownOpen(false);
                        }}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${formData.bookingType === opt.value
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : "hover:bg-gray-100 dark:hover:bg-white/5"}
                        `}
                      >
                        <div className={`p-2 rounded-lg ${formData.bookingType === opt.value ? "bg-white dark:bg-white/10" : "bg-gray-100 dark:bg-white/5"}`}>
                          {getRentalIcon(opt.value)}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm ${formData.bookingType === opt.value ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                            {opt.label}
                          </span>
                        </div>
                        {formData.bookingType === opt.value && <Check size={18} className="ml-auto text-blue-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                {errors.bookingType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.bookingType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#d4d4d4] text-gray-300">
                    tanggal main
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-gray-400" size={20} />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/5 border backdrop-blur-md rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.date ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-white/10 hover:border-blue-500/50"
                        }`}
                    />
                  </div>
                  {errors.date && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.date}</p>}
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#d4d4d4] text-gray-300">
                    nama lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      maxLength={15}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/5 border backdrop-blur-md rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-white/10 hover:border-blue-500/50"
                        }`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-semibold text-[#d4d4d4] text-gray-300">
                    nomor whatsapp
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 rounded-l-xl flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm">
                      +62
                    </div>
                    <input
                      type="tel"
                      placeholder="812-3456-7890"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phone: val });
                      }}
                      className={`w-full pl-20 pr-4 py-3.5 bg-white dark:bg-white/5 border backdrop-blur-md rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-white/10 hover:border-blue-500/50"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Konfirmasi Booking <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
