import { ArrowLeft, Search, RefreshCw, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useBookings } from "../hooks/useBookings";

interface BookingTrackingProps {
    onBack: () => void;
    onAdminLogin: () => void;
}

export default function BookingTracking({ onBack, onAdminLogin }: BookingTrackingProps) {
    const { bookings, loading, error, refetch } = useBookings();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter bookings based on search (Name or Code)
    // Note: In a real secure environment, we would encrypt the search term 
    // and queries the DB for the encrypted string. 
    // Here we filter the already decrypted client-side data for seamless UX.
    const filteredBookings = bookings.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "BOOKED": return "bg-blue-100 text-blue-700 bg-blue-900/40 text-blue-300 border-blue-200 border-blue-700";
            case "PAID": return "bg-emerald-100 text-emerald-700 bg-emerald-900/40 text-emerald-300 border-emerald-200 border-emerald-700";
            case "PLAYING": return "bg-green-100 text-green-700 bg-green-900/40 text-green-300 border-green-200 border-green-700 animate-pulse";
            case "DONE": return "bg-gray-100 text-gray-600 bg-gray-800 text-gray-400 border-gray-200 border-gray-700";
            case "CANCELLED": return "bg-red-100 text-red-600 bg-red-900/40 text-red-300 border-red-200 border-red-700";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div key="tracking-page" className="min-h-screen pt-28 pb-12 px-4 md:px-8 flex items-center justify-center animate-fadeInUp bg-[transparent] bg-transparent">

            <div className="max-w-6xl w-full bg-[black/40] bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-[white/10] border-white/20 shadow-2xl p-8 md:p-12 relative overflow-hidden flex flex-col">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#f5f5f5] text-white mb-2">Lacak Booking</h2>
                        <p className="text-[#d4d4d4] text-gray-400">Status rental real-time di RapsStation.</p>
                    </div>

                    {/* Search & Refresh */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari Kode / Nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[white/5] bg-white/5 border border-[white/10] border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-[#f5f5f5] text-white"
                            />
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="p-3 bg-[white/5] bg-white/5 border border-[white/10] border-white/10 rounded-xl hover:bg-white hover:shadow-md transition-all text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh Data"
                            disabled={loading}
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-[white/5] bg-white/5 rounded-3xl border border-[white/10] border-white/10 overflow-hidden relative z-10 shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[white/5] bg-white/5 border-b border-[white/10] border-white/10">
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">Kode Booking</th>
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">Nama Player</th>
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">No. HP</th>
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">Unit Rental</th>
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">Jam Main</th>
                                    <th className="p-5 text-sm font-bold text-[#d4d4d4] text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="animate-spin text-blue-500" size={32} />
                                                <p>Memuat data booking...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-red-500">
                                            <p>Gagal memuat data: {error}</p>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            {searchTerm ? "Data tidak ditemukan." : "Belum ada booking saat ini."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-blue-50/50 hover:bg-white/5 transition-colors duration-200"
                                        >
                                            <td className="p-5">
                                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 border-blue-800">
                                                    {item.id}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div
                                                    className="font-bold text-[#f5f5f5] text-white bg-[white/5] bg-white/10 w-fit px-3 py-1.5 rounded-xl border border-[white/10] border-white/5 shadow-sm cursor-help"
                                                    title={item.name} // Show full encrypted string on hover
                                                >
                                                    {item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name}
                                                </div>
                                            </td>
                                            <td className="p-5 text-[#d4d4d4] text-gray-300">
                                                <span title={item.phone} className="cursor-help">
                                                    {item.phone && item.phone.length > 10 ? item.phone.substring(0, 10) + "..." : (item.phone || "-")}
                                                </span>
                                            </td>
                                            <td className="p-5 text-[#d4d4d4] text-gray-300 font-medium">
                                                {item.unit}
                                            </td>
                                            <td className="p-5 text-[#d4d4d4] text-gray-400 font-medium whitespace-nowrap">
                                                {item.time === "UNSELECTED" ? (
                                                    <span className="text-yellow-600 text-yellow-400 italic text-sm">Menunggu Pembayaran</span>
                                                ) : (
                                                    item.time
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-3 px-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 font-semibold text-base w-fit"
                    >
                        <ArrowLeft size={20} /> Kembali ke Beranda
                    </button>

                    <button
                        onClick={onAdminLogin}
                        className="flex items-center justify-center gap-2 text-blue-500 hover:text-blue-400 transition-colors py-3 px-6 rounded-2xl hover:bg-blue-500/10 font-semibold text-base w-fit"
                    >
                        Lihat Table Lengkap <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
