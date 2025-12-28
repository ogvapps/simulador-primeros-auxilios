import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

const LegalDisclaimer = ({ onAccept, t }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('terms_accepted');
        if (!accepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('terms_accepted', 'true');
        setIsOpen(false);
        if (onAccept) onAccept();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden text-center">

                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                    <AlertTriangle size={40} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 mb-4">{t?.legal?.title || "Avisos Importantes"}</h2>

                <div className="text-left bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8 space-y-4 text-slate-600 text-sm leading-relaxed overflow-y-auto max-h-[40vh]">
                    <p>
                        <strong>{t?.legal?.purposeTitle || "1. Propósito Educativo:"}</strong> {t?.legal?.purposeDesc || "Esta aplicación es una herramienta de simulación interactiva diseñada exclusivamente con fines educativos e informativos sobre primeros auxilios básicos."}
                    </p>
                    <p>
                        <strong>{t?.legal?.medicalTitle || "2. No es Consejo Médico:"}</strong> {t?.legal?.medicalDesc || "El contenido NO sustituye el entrenamiento profesional certificado, ni el consejo, diagnóstico o tratamiento médico."}
                    </p>
                    <p className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 font-bold">
                        {t?.legal?.emergencyAlert || "🚨 En caso de una emergencia real, llama siempre inmediatamente al servicio de emergencias (112 o número local)."}
                    </p>
                    <p>
                        <strong>{t?.legal?.liabilityTitle || "3. Exención de Responsabilidad:"}</strong> {t?.legal?.liabilityDesc || "Los desarrolladores no se hacen responsables de los daños o perjuicios que pudieran derivarse del uso o interpretación de la información aquí contenida."}
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={24} />
                    {t?.legal?.accept || "He leído y Acepto"}
                </button>
            </div>
        </div>
    );
};

export default LegalDisclaimer;
