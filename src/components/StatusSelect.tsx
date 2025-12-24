import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { BOOKING_STATUSES } from "../constants";

interface StatusSelectProps {
    currentStatus: string;
    onStatusChange: (newStatus: string) => void;
}

export default function StatusSelect({ currentStatus, onStatusChange }: StatusSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
    const buttonRef = useRef<HTMLButtonElement>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "BOOKED": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "PAID": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "PLAYING": return "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse";
            case "DONE": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-white/5 text-gray-400 border-white/10";
        }
    };

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 250; // Approximated max height

            let newPlacement: 'bottom' | 'top' = 'bottom';
            let topPosition = rect.bottom + 8; // Default: below button

            // Auto-flip if tight space below but enough above
            if (spaceBelow < menuHeight && rect.top > menuHeight) {
                newPlacement = 'top';
                topPosition = rect.top - 8;
            }

            setPlacement(newPlacement);
            setCoords({
                top: topPosition,
                left: rect.left,
                width: 160
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updateCoords();
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
        }
        return () => {
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    const selectedOption = BOOKING_STATUSES.find(s => s.value === currentStatus) || { label: currentStatus, value: currentStatus };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`rotate-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 hover:brightness-110 w-full justify-between min-w-[120px] ${getStatusColor(currentStatus)}`}
            >
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Portal Menu */}
            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-start"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={`fixed z-[10000] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden animate-scaleIn custom-scrollbar ${placement === 'top' ? 'origin-bottom-left' : 'origin-top-left'}`}
                        style={{
                            top: placement === 'bottom' ? coords.top : 'auto',
                            bottom: placement === 'top' ? (window.innerHeight - coords.top) : 'auto',
                            left: coords.left - (160 - buttonRef.current!.offsetWidth),
                            width: 160,
                            maxHeight: '300px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                        <div className="p-1 max-h-[250px] overflow-y-auto relative custom-scrollbar">
                            {BOOKING_STATUSES.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => {
                                        if (currentStatus !== status.value) {
                                            // Pass to parent to handle confirmation
                                            onStatusChange(status.value);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all group ${currentStatus === status.value
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span className="flex-1">{status.label}</span>
                                    {currentStatus === status.value && (
                                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                            <Check size={10} className="text-green-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
