import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onSave, t }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#0f172a'; // slate-900
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Clear canvas on open
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
        }
    }, [isOpen]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSave = () => {
        if (!hasSignature) return;
        const canvas = canvasRef.current;
        // We could crop the canvas here, but for now we just take the dataURL
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl border-4 border-slate-800 animate-in zoom-in duration-300">
                <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-500 rounded-xl">
                            <PenTool size={20} />
                        </div>
                        <h3 className="text-xl font-black">FIRMA DEL PROFESOR</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <p className="text-slate-500 text-sm font-medium mb-6">
                        Dibuja tu firma en el recuadro de abajo. Esta firma aparecerá en todos los diplomas generados.
                    </p>

                    <div className="relative border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50 cursor-crosshair overflow-hidden touch-none">
                        <canvas
                            ref={canvasRef}
                            width={450}
                            height={200}
                            className="w-full h-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {!hasSignature && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 capitalize font-serif text-3xl font-black text-slate-400">
                                Firma aquí
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={clear}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-95"
                        >
                            <RotateCcw size={20} />
                            BORRAR
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasSignature}
                            className={`flex-1 flex items-center justify-center gap-2 ${hasSignature ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-bold py-4 rounded-2xl transition-all active:scale-95`}
                        >
                            <Check size={20} />
                            GUARDAR FIRMA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
