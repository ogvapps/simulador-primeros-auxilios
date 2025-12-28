import React, { memo, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react';

const TOAST_ICONS = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <AlertTriangle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <Bell className="text-yellow-500" size={20} />
};

const TOAST_STYLES = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800"
};

const Toast = memo(({ id, type = 'info', message, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 max-w-sm w-full pointer-events-auto ${TOAST_STYLES[type]}`}>
            <div className="flex-shrink-0 mt-0.5">
                {TOAST_ICONS[type]}
            </div>
            <div className="flex-1 text-sm font-semibold leading-relaxed">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
});

export const ToastContainer = ({ toasts, removeToast }) => {
    // Fixed container at top center/right
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onClose={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
