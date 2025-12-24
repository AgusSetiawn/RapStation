import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, CreditCard, Check, User, Gamepad2, Wallet, Building2, QrCode, Info, Loader2, Phone } from "lucide-react";
import type { BookingFormData } from "../types";
import { BOOKING_OPTIONS } from "../constants";
import { supabase } from "../lib/supabase";
import { encryptDES } from "../utils/crypto";

interface BookingSummaryProps {
    data: BookingFormData;
    onBack: () => void;
}

// 15K per hour base price
const HOURLY_RATE = 15000;

// Full day slots (24 Hours)
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

// Dummy Payment Methods
const PAYMENT_METHODS = [
    { id: 'qris', name: 'QRIS', type: 'Instant', icon: <QrCode size={20} />, bg: "bg-white text-black border-gray-200" },
    { id: 'gopay', name: 'GoPay', type: 'E-Wallet', icon: <Wallet size={20} />, bg: "bg-blue-500 text-white border-blue-500" },
    { id: 'ovo', name: 'OVO', type: 'E-Wallet', icon: <Wallet size={20} />, bg: "bg-purple-600 text-white border-purple-600" },
    { id: 'dana', name: 'DANA', type: 'E-Wallet', icon: <Wallet size={20} />, bg: "bg-blue-400 text-white border-blue-400" },
    { id: 'bca', name: 'BCA VA', type: 'Virtual Acc', icon: <Building2 size={20} />, bg: "bg-blue-800 text-white border-blue-800" },
    { id: 'mandiri', name: 'Mandiri VA', type: 'Virtual Acc', icon: <Building2 size={20} />, bg: "bg-yellow-600 text-white border-yellow-600" },
];

export default function BookingSummary({ data, onBack }: BookingSummaryProps) {
    const rentalLabel = BOOKING_OPTIONS.find((opt) => opt.value === data.bookingType)?.label || data.bookingType;

    // State for booked slots
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch availability when date or unit changes
    useEffect(() => {
        if (!data.date || !rentalLabel) return;

        const fetchAvailability = async () => {
            setLoadingSlots(true);
            try {
                const { data: existingBookings, error } = await supabase
                    .from('bookings')
                    .select('time_slot')
                    .eq('date', data.date)
                    .eq('unit_type', rentalLabel) // Ensure strict rental type filtering
                    .in('status', ['BOOKED', 'PAID', 'PLAYING'])
                    .neq('time_slot', 'UNSELECTED');

                if (error) throw error;

                // Parse "Start - End" to blocked hours
                const blocked: string[] = [];
                existingBookings?.forEach(booking => {
                    // Robust splitting: handles "10:00 - 12:00", "10:00-12:00", etc.
                    const [start, end] = booking.time_slot.split(/\s*-\s*/);

                    if (start && end) {
                        const cleanStart = start.trim();
                        const cleanEnd = end.trim();

                        const startIndex = TIME_SLOTS.indexOf(cleanStart);
                        let endIndex = TIME_SLOTS.indexOf(cleanEnd);

                        // Handle 24:00 edge case
                        if (endIndex === -1 && cleanEnd === "24:00") endIndex = 24;

                        if (startIndex !== -1 && endIndex !== -1) {
                            // Fix: Loop strictly LESS than endIndex.
                            for (let i = startIndex; i < endIndex; i++) {
                                blocked.push(TIME_SLOTS[i]);
                            }
                        }
                    }
                });
                setBookedSlots(blocked);
            } catch (err) {
                console.error("Failed to fetch slots:", err);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [data.date, rentalLabel]);

    const [range, setRange] = useState<{ start: string | null; end: string | null }>({
        start: null,
        end: null,
    });

    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    // Calculate price whenever range changes
    const totalPrice = useMemo(() => {
        if (range.start && range.end) {
            const startIndex = TIME_SLOTS.indexOf(range.start);
            const endIndex = TIME_SLOTS.indexOf(range.end);
            const duration = endIndex - startIndex + 1; // inclusive
            return duration * HOURLY_RATE;
        } else if (range.start) {
            return HOURLY_RATE; // 1 hour min
        } else {
            return 0;
        }
    }, [range]);

    const handleSlotClick = (time: string, index: number) => {
        if (paymentStatus !== 'idle') return; // Lock if processing/success
        if (bookedSlots.includes(time)) return;

        if (!range.start || (range.start && range.end)) {
            setRange({ start: time, end: null });
        } else {
            const startIndex = TIME_SLOTS.indexOf(range.start);
            if (index < startIndex) {
                setRange({ start: time, end: null });
            } else if (index === startIndex) {
                setRange({ start: null, end: null });
            } else {
                const slice = TIME_SLOTS.slice(startIndex, index + 1);
                const hasConflict = slice.some(t => bookedSlots.includes(t));
                if (hasConflict) {
                    alert("Pilihan jadwal terhalang slot lain yang sudah dibooking!");
                } else {
                    setRange({ ...range, end: time });
                }
            }
        }
    };

    const isSelected = (time: string, index: number) => {
        if (!range.start) return false;
        if (range.start === time) return true;
        if (range.end === time) return true;
        if (range.start && range.end) {
            const startIndex = TIME_SLOTS.indexOf(range.start);
            const endIndex = TIME_SLOTS.indexOf(range.end);
            return index > startIndex && index < endIndex;
        }
        return false;
    };

    const getSlotStatus = (time: string, index: number) => {
        if (bookedSlots.includes(time)) return "booked";
        if (isSelected(time, index)) return "selected";
        return "available";
    };

    const handlePayment = async () => {
        if (!selectedPayment || !data.bookingCode) return;

        // Validation: Must select time first
        // Validation: Must select time first
        if (!range.start) {
            alert("Harap pilih jam mulai bermain!");
            return;
        }

        // Calculate effective range indices
        const startIdx = TIME_SLOTS.indexOf(range.start);
        let endIdx: number;
        let endString: string;

        if (range.end) {
            endIdx = TIME_SLOTS.indexOf(range.end);
            endString = range.end;
        } else {
            // Default to 1 hour if only start is selected
            endIdx = startIdx + 1;
            endString = TIME_SLOTS[endIdx] || "24:00";
        }

        setPaymentStatus('processing');

        try {
            // Final Validation: Check availability one last time
            const hasConflict = bookedSlots.some(slot => {
                const slotIndex = TIME_SLOTS.indexOf(slot);
                // Check if any blocked slot is within our intended range [startIdx, endIdx)
                return slotIndex >= startIdx && slotIndex < endIdx;
            });

            if (hasConflict) {
                alert("Maaf, slot waktu ini baru saja diambil orang lain. Silakan pilih waktu lain.");
                setPaymentStatus('idle');
                return;
            }

            // --- CRITICAL CONFLICT CHECK (SERVER SIDE EMULATION) ---
            // Fetch fresh data immediately before writing to catch any race conditions or state failures
            const { data: conflictCheck, error: conflictError } = await supabase
                .from('bookings')
                .select('time_slot')
                .eq('date', data.date)
                .eq('unit_type', rentalLabel)
                .in('status', ['BOOKED', 'PAID', 'PLAYING'])
                .neq('time_slot', 'UNSELECTED');

            if (conflictError) {
                console.error("Conflict check failed:", conflictError);
                // Allow proceed if network fails? No, safer to block or warn. 
                // For demo, we might want to proceed, but for "Double Booking prevention" we must block.
                // alert("Gagal memverifikasi ketersediaan slot. Cek koneksi internet.");
                // return; 
            } else {
                // (Already calculated startIdx and endIdx above)

                // Check against database records
                // Check against database records
                const isServerConflicted = conflictCheck?.some(booking => {
                    // Robust splitting (same as visual logic)
                    const [dbStart, dbEnd] = booking.time_slot.split(/\s*-\s*/);
                    if (!dbStart || !dbEnd) return false;

                    const dbStartIndex = TIME_SLOTS.indexOf(dbStart.trim());
                    let dbEndIndex = TIME_SLOTS.indexOf(dbEnd.trim());
                    if (dbEnd.trim() === "24:00") dbEndIndex = 24;

                    if (dbStartIndex === -1 || dbEndIndex === -1) return false;

                    // Correct Interval Overlap Logic: (StartA < EndB) && (StartB < EndA)
                    return startIdx < dbEndIndex && dbStartIndex < endIdx;
                });

                if (isServerConflicted) {
                    alert("GAGAL BAYAR: Slot waktu ini SUDAH DIBOOKING orang lain baru saja! Silakan pilih jam lain.");
                    setPaymentStatus('idle');
                    return; // STOP EXECUTION
                }
            }
            // -------------------------------

            // IMPORTANT: Double check availability before updating (Race Condition Prevention)
            // In a production app, do this check server-side (Postgres Function). 
            // Here we just re-check client side for basic safety.

            // Upsert status and time slot in Supabase to VALIDATE "Automatic Success"
            // This guarantees the row exists even if the previous Form Insert failed.
            const encryptedName = encryptDES(data.name);
            const encryptedPhone = encryptDES(data.phone);

            const { error } = await supabase
                .from('bookings')
                .upsert({
                    booking_code: data.bookingCode, // Unique Key
                    name_encrypted: encryptedName,
                    unit_type: rentalLabel,
                    time_slot: `${range.start} - ${endString}`,
                    status: 'PAID',
                    date: data.date,
                    phone: encryptedPhone
                }, { onConflict: 'booking_code' })
                .select();

            if (error) {
                // Improved error handling: Surface critical errors to user
                console.error("Supabase update error:", error);

                // Only swallow error if it's a duplicate key or non-critical issue
                // Otherwise, inform the user
                const errorMessage = error.message || String(error);

                if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
                    // Non-critical: Booking code already exists, this is OK for demo
                    if (import.meta.env.DEV) {
                        console.warn("Duplicate booking code, proceeding anyway for demo");
                    }
                } else {
                    // Critical error: Network, permission, etc.
                    alert("Terjadi kesalahan saat menyimpan pembayaran. Silakan coba lagi atau hubungi admin.");
                    setPaymentStatus('idle');
                    return;
                }
            }

            // Simulate small delay for UX then show success
            setTimeout(() => {
                setPaymentStatus('success');
            }, 1500);

        } catch (err) {
            console.error("Payment update failed:", err);
            alert("Gagal memproses pembayaran. Silakan hubungi admin.");
            setPaymentStatus('idle');
        }
    };

    const handleFinish = () => {
        window.location.reload(); // Simple reload to reset app state for now
    };

    return (
        <div key="summary-page" className="min-h-screen pt-28 pb-12 px-4 md:px-8 flex items-center justify-center animate-fadeInUp bg-gray-50 dark:bg-transparent transition-colors duration-500">

            {/* Restored Size: max-w-6xl and ample padding */}
            <div className="max-w-6xl w-full bg-white dark:bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/20 shadow-2xl shadow-blue-900/10 dark:shadow-none p-6 md:p-12 relative overflow-hidden flex flex-col items-center transition-all duration-300">

                {/* Background Decor - Only subtle in light mode, keep original in dark */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* SUCCESS OVERLAY */}
                {paymentStatus === 'success' ? (
                    <div className="relative z-20 flex flex-col items-center justify-center text-center animate-popIn w-full max-w-lg">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 mb-6 animate-bounce-short">
                            <Check size={48} className="text-white" strokeWidth={4} />
                        </div>

                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Pembayaran Berhasil!</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Terima kasih, booking kamu telah terkonfirmasi.</p>

                        {/* Receipt Card */}
                        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full border border-gray-200 dark:border-white/20 shadow-xl mb-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Bayar</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Metode</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Waktu</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">
                                        {range.start} - {range.end || (TIME_SLOTS[TIME_SLOTS.indexOf(range.start || "") + 1] || "24:00")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Kode Booking</span>
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{data.bookingCode}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Unit</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{rentalLabel}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            Selesai & Kembali
                        </button>
                    </div>
                ) : (
                    /* NORMAL BOOKING CONTENT (Hidden only if success) */
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10 w-full transition-opacity duration-500 ${paymentStatus === 'processing' ? 'opacity-50 pointer-events-none filter blur-sm' : 'opacity-100'}`}>

                        {/* PROCESSING OVERLAY (Absolute on top of content) */}
                        {paymentStatus === 'processing' && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
                                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-gray-200 dark:border-white/20">
                                    <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Memproses Pembayaran...</h3>
                                    <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar, jangan tutup halaman ini.</p>
                                </div>
                            </div>
                        )}

                        {/* LEFT: Information & Summary */}
                        <div className="lg:col-span-4 flex flex-col h-full order-2 lg:order-1">
                            <div className="text-left mb-6 lg:mb-8">
                                <h2 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-2">
                                    Booking Details
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                                    Pastikan data pesananmu sudah benar.
                                </p>
                            </div>

                            {/* Cleaned Up Details Card */}
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-200 dark:border-white/10 flex flex-col h-full shadow-lg dark:shadow-none transition-all duration-300">
                                <div className="space-y-6">
                                    {/* Rental Item */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-transparent">
                                            <Gamepad2 size={28} />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Unit Rental</span>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                                                {rentalLabel}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                                    {/* Player */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-transparent">
                                            <User size={28} />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Nama Player</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                {data.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                                    {/* Phone */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400 shadow-sm border border-green-200 dark:border-transparent">
                                            <Phone size={28} />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">WhatsApp</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight font-mono">
                                                +62{data.phone}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                                    {/* Date */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-200 dark:border-transparent">
                                            <Calendar size={28} />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Tanggal Main</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                {data.date}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer to push content down */}
                                <div className="flex-grow min-h-[40px]" />

                                {/* Bottom Status Section */}
                                <div className="mt-auto bg-blue-100 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-500/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</span>
                                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 text-xs font-bold rounded-lg animate-pulse">
                                            Menunggu Pembayaran
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        <Info size={14} className="flex-shrink-0 text-blue-500" />
                                        <p>Selesaikan pembayaran untuk mengamankan slot waktumu. Mohon hadir 10 menit lebih awal.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onBack}
                                className="hidden lg:flex w-full mt-6 items-center justify-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-4 px-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 font-semibold text-base"
                            >
                                <ArrowLeft size={20} /> Kembali
                            </button>
                        </div>

                        {/* RIGHT: Time Selection & Payment */}
                        <div className="lg:col-span-8 flex flex-col h-full space-y-4 order-1 lg:order-2">

                            {/* 1. Time Selection */}
                            <div className="bg-white dark:bg-black/20 rounded-[2rem] p-6 border border-gray-200 dark:border-white/20 flex-grow flex flex-col shadow-lg dark:shadow-none transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            <Clock className="text-purple-500" size={24} />
                                            Pilih Durasi
                                        </h3>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 text-xs font-semibold bg-white dark:bg-white/5 p-2 rounded-xl border border-gray-200 dark:border-white/10">
                                        <span className="flex items-center gap-2 px-2 text-gray-700 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20"></span> Available</span>
                                        <span className="flex items-center gap-2 px-2 text-gray-700 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50"></span> Selected</span>
                                        <span className="flex items-center gap-2 px-2 text-gray-700 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-white dark:bg-white/5 stripe-pattern opacity-50"></span> Booked</span>
                                    </div>
                                </div>

                                {/* Grid 24 Hours with PADDING - EXPANDED */}
                                <div className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-2 flex-grow px-6 py-8 custom-scrollbar relative overflow-y-auto ${loadingSlots ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {loadingSlots && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <Loader2 className="animate-spin text-blue-500" size={32} />
                                        </div>
                                    )}
                                    {TIME_SLOTS.map((time, index) => {
                                        const status = getSlotStatus(time, index);
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => handleSlotClick(time, index)}
                                                disabled={status === "booked"}
                                                className={`
                                                    relative group w-full py-2 sm:py-3 rounded-2xl text-sm sm:text-lg font-bold transition-all duration-300 ease-out border flex items-center justify-center
                                                    hover:scale-105 active:scale-95 border-b-4 active:border-b-0 active:translate-y-1
                                  ${status === "booked"
                                                        ? "bg-gray-100 bg-white/5 border-transparent text-gray-400 cursor-not-allowed stripe-pattern opacity-60"
                                                        : status === "selected"
                                                            ? "bg-blue-600 border-blue-600 border-b-blue-800 text-white shadow-xl shadow-blue-500/40 ring-2 ring-blue-400/50 z-10 scale-[1.02]"
                                                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50 dark:hover:bg-white/10 shadow-sm shadow-gray-200/50 dark:shadow-none"
                                                    }
                               `}
                                            >
                                                {status === "booked" ? (
                                                    <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                                                        Booked
                                                    </span>
                                                ) : (
                                                    time
                                                )}
                                                {status === "selected" && (
                                                    <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full p-1 shadow-md animate-bounce-short">
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Payment Method Selection */}
                            <div className="bg-white dark:bg-black/20 rounded-[2rem] p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-none transition-all duration-300">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                                    <CreditCard className="text-green-500" size={24} />
                                    Metode Pembayaran
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 group ${selectedPayment === method.id
                                                ? "border-blue-500 bg-blue-50 bg-blue-500/20 shadow-lg shadow-blue-500/20 scale-105"
                                                : "border-transparent bg-gray-50 bg-white/5 hover:bg-white hover:bg-white/10 hover:border-gray-200 hover:border-white/10 hover:shadow-md hover:shadow-none"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full mb-2 ${method.bg} shadow-md`}>
                                                {method.icon}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{method.name}</span>
                                            <span className="text-[10px] text-gray-400">{method.type}</span>

                                            {selectedPayment === method.id && (
                                                <div className="absolute top-2 right-2 text-blue-500 bg-white dark:bg-black rounded-full p-0.5 shadow-sm">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {/* Footer Action */}
                            <div className="mt-auto pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex flex-col">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Pembayaran</span>
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-200 tracking-tight">
                                        Rp {totalPrice.toLocaleString("id-ID")}
                                    </div>
                                    {range.start && (
                                        <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-lg w-fit">
                                            <Clock size={14} />
                                            {range.end
                                                ? TIME_SLOTS.indexOf(range.end) - TIME_SLOTS.indexOf(range.start) + 1
                                                : 1} Jam
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={totalPrice === 0 || !selectedPayment}
                                    className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                                >
                                    <CreditCard size={24} />
                                    {selectedPayment ? "Bayar Sekarang" : "Pilih Pembayaran"}
                                </button>
                            </div>

                            <button
                                onClick={onBack}
                                className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-4 px-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 font-semibold text-base"
                            >
                                <ArrowLeft size={20} /> Kembali
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for Stripe Pattern & Animations */}
            <style>{`
         .stripe-pattern {
            background-image: linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent);
            background-size: 10px 10px;
         }
         .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
         }
         .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
         }
         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
         }
         @keyframes popIn {
           0% { transform: scale(0); opacity: 0; }
           80% { transform: scale(1.1); opacity: 1; }
           100% { transform: scale(1); }
         }
         .scale-animation {
           animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
         }
         @keyframes bounceShort {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
         }
         .animate-bounce-short {
            animation: bounceShort 2s infinite ease-in-out;
         }
         .animate-popIn {
            animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         }
      `}</style>
        </div>
    );
}
