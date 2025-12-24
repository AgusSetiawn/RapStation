import { X, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    type = 'info',
    onConfirm,
    onCancel,
    confirmLabel = "Confirm"
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <Trash2 className="w-6 h-6 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'info': default: return <CheckCircle className="w-6 h-6 text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'danger': return "bg-red-500 hover:bg-red-600 border-red-400";
            case 'warning': return "bg-yellow-500 hover:bg-yellow-600 border-yellow-400 text-black";
            case 'info': default: return "bg-blue-500 hover:bg-blue-600 border-blue-400";
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-6 animate-scaleIn overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full bg-white/5 border border-white/10 mb-4`}>
                        {getIcon()}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm mb-6">{message}</p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all font-semibold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-xl border border-t-2 text-white shadow-lg transition-all font-bold text-sm hover:scale-105 active:scale-95 ${getButtonColor()}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
