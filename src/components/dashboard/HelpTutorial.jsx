import React, { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, BookOpen, Award, Target, Gamepad2, ShieldAlert } from 'lucide-react';

const HelpTutorial = ({ isOpen, onClose, t }) => {
    const [step, setStep] = useState(0);

    const steps = useMemo(() => [
        {
            title: t?.tutorial?.welcomeTitle || "¡Bienvenido al Simulador PAS!",
            desc: t?.tutorial?.welcomeDesc || "Tu misión es convertirte en un experto en Primeros Auxilios. Aprenderás a salvar vidas reales con el método Proteger, Avisar y Socorrer.",
            icon: <ShieldAlert size={64} className="text-red-500" />,
            color: "bg-red-50 border-red-200"
        },
        {
            title: t?.tutorial?.step1Title || "1. Completa los Módulos",
            desc: t?.tutorial?.step1Desc || "Tienes temas teóricos y minijuegos prácticos. Debes completarlos TODOS para desbloquear el Examen Final.",
            icon: <BookOpen size={64} className="text-blue-500" />,
            color: "bg-blue-50 border-blue-200"
        },
        {
            title: t?.tutorial?.step2Title || "2. Gana XP y Sube de Nivel",
            desc: t?.tutorial?.step2Desc || "Cada módulo te da puntos (XP). Acumula XP para subir de rango (Novato -> Maestro) y comprar nuevos avatares en la tienda.",
            icon: <Gamepad2 size={64} className="text-purple-500" />,
            color: "bg-purple-50 border-purple-200"
        },
        {
            title: t?.tutorial?.step3Title || "3. El Examen Final",
            desc: t?.tutorial?.step3Desc || "Al final te enfrentarás a 40 preguntas.",
            subtext: t?.tutorial?.step3Subtext || "⚠ ¡ATENCIÓN! Tienes solo 5 intentos. Tu nota máxima bajará en cada intento fallido (10, 9, 8...). ¡Prepárate bien!",
            icon: <Target size={64} className="text-orange-500" />,
            color: "bg-orange-50 border-orange-200"
        },
        {
            title: t?.tutorial?.certTitle || "Tu Certificado",
            desc: t?.tutorial?.certDesc || "Si apruebas el examen, obtendrás tu Diploma Oficial del curso. ¡Demuestra que estás listo para ayudar!",
            icon: <Award size={64} className="text-yellow-500" />,
            color: "bg-yellow-50 border-yellow-200"
        }
    ], [t]);

    if (!isOpen) return null;

    const current = steps[step];
    const isLast = step === steps.length - 1;

    const handleNext = () => {
        if (isLast) {
            onClose();
            setTimeout(() => setStep(0), 300); // Reset for next open
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col min-h-[500px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Progress Bar */}
                <div className="flex gap-1 p-6 pb-0">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-slate-100'}`} />
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-right-8 fade-in duration-300 transform" key={step}>
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-inner ${current.color}`}>
                        {current.icon}
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 mb-4 leading-tight">{current.title}</h2>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">{current.desc}</p>

                    {current.subtext && (
                        <div className="mt-6 p-4 bg-orange-50 text-orange-800 text-sm font-bold rounded-xl border border-orange-100 flex items-start text-left">
                            {current.subtext}
                        </div>
                    )}
                </div>

                {/* Footer Nav */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <button
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 disabled:opacity-0 transition-all"
                    >
                        {t?.tutorial?.prev || "Anterior"}
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isLast ? (t?.tutorial?.understood || "¡Entendido!") : (t?.tutorial?.next || "Siguiente")}
                        {!isLast && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpTutorial;
