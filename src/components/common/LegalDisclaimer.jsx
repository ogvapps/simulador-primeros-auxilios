import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const LegalDisclaimer = ({ isOpen: controlledIsOpen, onClose, onAccept, t }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (controlledIsOpen !== undefined) {
            setIsOpen(controlledIsOpen);
        } else {
            const accepted = localStorage.getItem('terms_accepted');
            if (!accepted) {
                setIsOpen(true);
            }
        }
    }, [controlledIsOpen]);

    const handleAccept = () => {
        localStorage.setItem('terms_accepted', 'true');
        setIsOpen(false);
        if (onAccept) onAccept();
        if (onClose) onClose();
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center border border-slate-100">
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600">
                    <AlertTriangle size={36} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 mb-2">{t?.legal?.title || "Términos y Aviso Legal"}</h2>
                <p className="text-xs text-slate-400 font-semibold mb-4">Uso educativo y directrices de seguridad escolar</p>

                <div className="text-left bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[45vh]">
                    <p>
                        <strong>{t?.legal?.purposeTitle || "1. Propósito Educativo Escolar:"}</strong> {t?.legal?.purposeDesc || "Esta aplicación es una herramienta interactiva diseñada exclusivamente con fines formativos para centros educativos sobre primeros auxilios básicos y conducta P.A.S. (Proteger, Avisar, Socorrer)."}
                    </p>
                    <p>
                        <strong>{t?.legal?.medicalTitle || "2. No es Consejo Médico Certificado:"}</strong> {t?.legal?.medicalDesc || "El contenido es didáctico y NO sustituye el entrenamiento profesional de emergencias sanitarias ni el criterio médico."}
                    </p>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 font-bold text-xs sm:text-sm">
                        {t?.legal?.emergencyAlert || "🚨 En caso de una emergencia real, llama siempre inmediatamente al servicio de emergencias (112 en España y la Unión Europea)."}
                    </div>
                    <p>
                        <strong>3. Protección de Datos (RGPD y LOPDGDD):</strong> El tratamiento de datos escolares de alumnos se limita estrictamente a fines de evaluación formativa al amparo de la Disposición Adicional 23ª de la Ley Orgánica 2/2006 (LOE/LOMLOE). No se ceden datos a terceros ni se realiza perfilado comercial.
                    </p>
                    <p>
                        <strong>{t?.legal?.liabilityTitle || "4. Exención de Responsabilidad:"}</strong> {t?.legal?.liabilityDesc || "Los autores del proyecto no se hacen responsables de la ejecución práctica errónea en situaciones reales ajenas a la simulación escolar."}
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    <CheckCircle2 size={20} />
                    {t?.legal?.accept || "He leído y Acepto las Condiciones"}
                </button>
            </div>
        </div>
    );
};

export default LegalDisclaimer;
