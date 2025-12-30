import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { XP_REWARDS } from '../../data/constants';
import confetti from 'canvas-confetti';

const GlossaryView = ({ glossary, progress, onComplete, onBack, playSound, addToast, updateDailyStats }) => {
    const [checkedTerms, setCheckedTerms] = useState(new Set());

    const handleTermCheck = (idx) => {
        const newChecked = new Set(checkedTerms);
        if (newChecked.has(idx)) {
            newChecked.delete(idx);
        } else {
            newChecked.add(idx);
            // Update glossary views count (each new check counts as a view)
            updateDailyStats('glossaryViews', 1);
        }
        setCheckedTerms(newChecked);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-8 pb-32">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:bg-slate-50 p-3 rounded-xl transition-colors">
                        <BookOpen />
                    </button>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Glosario</h2>
                </div>
                <div className="text-sm font-bold text-slate-500">
                    {checkedTerms.size} / {glossary.length} términos consultados
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {glossary.map((item, idx) => {
                    const isChecked = checkedTerms.has(idx);
                    return (
                        <div
                            key={idx}
                            onClick={() => handleTermCheck(idx)}
                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${isChecked
                                    ? 'border-green-400 bg-green-50 shadow-md'
                                    : 'border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-md bg-slate-50/50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isChecked
                                        ? 'bg-green-500 border-green-500'
                                        : 'bg-white border-slate-300'
                                    }`}>
                                    {isChecked && (
                                        <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold text-xl mb-2 ${isChecked ? 'text-green-700' : 'text-brand-600'
                                        }`}>
                                        {item.t}
                                    </h3>
                                    <p className={`font-medium leading-relaxed ${isChecked ? 'text-slate-500' : 'text-slate-600'
                                        }`}>
                                        {item.d}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Glossary Completion Action */}
            <div className="mt-8 bg-brand-50 border-2 border-brand-100 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-4">
                {!progress.glosarioCompleted ? (
                    <>
                        <h3 className="font-bold text-brand-800 text-lg mb-2">¿Has revisado todos los términos?</h3>
                        <p className="text-brand-600 mb-6 text-sm">Completa este módulo para ganar tu recompensa de XP.</p>
                        <button
                            onClick={() => {
                                onComplete();
                                try { playSound('success'); } catch (e) { }
                                addToast('¡Módulo Glosario Completado!', 'success');
                                confetti();
                            }}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                        >
                            <CheckCircle2 size={20} />
                            Marcar como Leído (+{XP_REWARDS.MODULE_COMPLETE} XP)
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-emerald-600 animate-in zoom-in">
                        <div className="bg-emerald-100 p-3 rounded-full">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="font-bold text-lg">¡Módulo Completado!</h3>
                        <p className="text-sm opacity-80">Ya has recibido tu recompensa por este módulo.</p>
                        <button onClick={onBack} className="mt-4 text-emerald-700 font-bold hover:underline">Volver al Inicio</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlossaryView;
