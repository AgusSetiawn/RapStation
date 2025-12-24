import { useState, useMemo } from "react";
import { Search, RefreshCw, Key, DollarSign, ShoppingCart, LogOut, TrendingUp, Calendar, ArrowUpRight, ShieldCheck, Trash2 } from "lucide-react";
import StatusSelect from "./StatusSelect";
import ConfirmationModal from "./ConfirmationModal";
import { useBookings } from "../hooks/useBookings";
import { decryptDES } from "../utils/crypto";

interface AdminDashboardProps {
    onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const { bookings, loading, error, refetch, updateBookingStatus, deleteBooking } = useBookings();
    const [searchTerm, setSearchTerm] = useState("");
    const [decryptionKey, setDecryptionKey] = useState("");
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: 'info',
        onConfirm: () => { },
    });

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const confirmStatusChange = (id: string, newStatus: string) => {
        setModalConfig({
            isOpen: true,
            title: "Update Status",
            message: `Are you sure you want to change the status to "${newStatus}"?`,
            type: 'info',
            confirmLabel: "Update",
            onConfirm: async () => {
                await updateBookingStatus(id, newStatus);
                closeModal();
            }
        });
    };

    const confirmDelete = (id: string) => {
        setModalConfig({
            isOpen: true,
            title: "Delete Transaction",
            message: `Are you sure you want to delete transaction ${id}? This action cannot be undone.`,
            type: 'danger',
            confirmLabel: "Delete",
            onConfirm: async () => {
                await deleteBooking(id);
                closeModal();
            }
        });
    };

    // Filter bookings
    const filteredBookings = bookings.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate Stats
    const stats = useMemo(() => {
        const total = bookings.length;
        const totalPaid = bookings.filter(b => b.status === 'PAID' || b.status === 'PLAYING' || b.status === "DONE").length;
        const active = bookings.filter(b => b.status === 'PLAYING').length;

        // Dummy revenue calculation
        const revenue = bookings.reduce((acc, curr) => {
            if (['PAID', 'PLAYING', 'DONE'].includes(curr.status)) {
                return acc + 15000;
            }
            return acc;
        }, 0);

        return { total, totalPaid, active, revenue };
    }, [bookings]);

    const getDecryptedValue = (encryptedValue: string) => {
        if (!decryptionKey) return encryptedValue;
        const decrypted = decryptDES(encryptedValue, decryptionKey);
        return decrypted || encryptedValue;
    };


    return (
        <div key="admin-dashboard" className="min-h-screen pt-28 pb-12 px-4 md:px-8 bg-[url('/grid.svg')] bg-fixed">

            {/* Ambient Backlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                    <div className="text-left space-y-1">
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                            Admin Portal
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Operational
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all font-semibold shadow-lg shadow-red-500/5 hover:shadow-red-500/20 active:scale-95"
                    >
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>

                {/* Stats Cards - Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:bg-white/10 group animate-scaleIn stagger-1 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <ShoppingCart size={24} />
                            </div>
                            <span className="flex items-center text-xs text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                                <TrendingUp size={12} className="mr-1" /> +12%
                            </span>
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-blue-200 transition-colors">{stats.total}</h3>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:bg-white/10 group animate-scaleIn stagger-2 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                <DollarSign size={24} />
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <ArrowUpRight size={16} className="text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Revenue</p>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-emerald-200 transition-colors">Rp {stats.revenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10 group animate-scaleIn stagger-3 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Paid / Secure</p>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-purple-200 transition-colors">{stats.totalPaid}</h3>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:bg-white/10 group animate-scaleIn stagger-4 hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-colors animate-pulse" />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <RefreshCw size={24} className="animate-spin-slow" />
                            </div>
                            <span className="flex items-center text-xs text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 animate-pulse">
                                LIVE
                            </span>
                        </div>
                        <div className="text-left relative z-10">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Active Now</p>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-green-200 transition-colors">{stats.active}</h3>
                        </div>
                    </div>
                </div>


                {/* Main Content Area */}
                <div className="w-full bg-neutral-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl p-6 md:p-10 relative overflow-hidden flex flex-col animate-slideInDown animation-delay-500">

                    {/* Top Gradient Border */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <Calendar size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Data Transaksi</h3>
                                <p className="text-sm text-gray-500">Manage all recent bookings</p>
                            </div>

                            <button
                                onClick={() => refetch()}
                                disabled={loading}
                                className="ml-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-blue-400 hover:scale-105 active:scale-95"
                                title="Refresh Data"
                            >
                                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Decryption Key Input */}
                            <div className="group flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all hover:bg-white/5">
                                <Key size={18} className={decryptionKey ? "text-purple-400" : "text-gray-500"} />
                                <div className="h-6 w-px bg-white/10" />
                                <input
                                    type={showKeyInput ? "text" : "password"}
                                    placeholder="Decryption Key"
                                    value={decryptionKey}
                                    onChange={(e) => setDecryptionKey(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white text-sm w-36 placeholder-gray-500 focus:ring-0"
                                />
                                <button onClick={() => setShowKeyInput(!showKeyInput)} className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-lg transition-colors">
                                    {showKeyInput ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-72 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by ID or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white text-sm placeholder-gray-600 hover:bg-white/5"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Premium Glass Table */}
                    <div className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden relative z-10 shadow-inner flex-1">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5">
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">ID</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Unit</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Slot</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                                    <p className="animate-pulse font-mono text-sm">Synchronizing Data...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center text-red-500 bg-red-500/5">
                                                <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
                                                <p className="font-bold">Connection Error</p>
                                                <p className="text-sm opacity-80">{error}</p>
                                            </td>
                                        </tr>
                                    ) : filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center opacity-50">
                                                    <Search size={48} className="mb-4" />
                                                    <p>No matching records found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="group hover:bg-white/[0.03] transition-colors duration-200 animate-fadeInUp"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-[10px] font-bold text-gray-400 border border-white/10 group-hover:border-blue-500/30 transition-colors shrink-0">
                                                            #{index + 1}
                                                        </div>
                                                        <span className="font-mono font-bold text-blue-200/80 group-hover:text-blue-400 transition-colors whitespace-nowrap">
                                                            {item.id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 max-w-[150px]">
                                                    <span className={`block truncate font-semibold tracking-wide ${decryptionKey ? "text-white" : "text-gray-600 blur-[2px] hover:blur-none transition-all duration-300"}`}>
                                                        {getDecryptedValue(item.name)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 max-w-[150px]">
                                                    <span className={`block truncate font-mono text-sm ${decryptionKey ? "text-gray-300" : "text-gray-700 blur-[2px] hover:blur-none transition-all duration-300"}`}>
                                                        {getDecryptedValue(item.phone)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 whitespace-nowrap">
                                                        {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400 font-medium text-sm whitespace-nowrap">
                                                    {item.time}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusSelect
                                                        currentStatus={item.status}
                                                        onStatusChange={(newStatus) => confirmStatusChange(item.id, newStatus)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => confirmDelete(item.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        title="Delete Transaction"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
                onCancel={closeModal}
                confirmLabel={modalConfig.confirmLabel}
            />
        </div>
    );
}
