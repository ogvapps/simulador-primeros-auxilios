import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, Activity, XCircle, CheckCircle2, ThumbsUp, ThumbsDown, Volume2, User, Play, RefreshCcw } from 'lucide-react';

const RoleplayGame = ({ scenarioId, scenario, t, onComplete, onBack, playSound }) => {
    if (!scenario) return <div className="p-8 text-center text-red-500 font-bold">Scenario not found: {scenarioId}</div>;

    const [currentNodeId, setCurrentNodeId] = useState(scenario.startNode);
    const [history, setHistory] = useState([]);
    const [fade, setFade] = useState(false); // For transition effect

    // Derived state
    const currentNode = scenario.nodes[currentNodeId];

    // Transition handler
    const transitionTo = (nextId) => {
        setFade(true);
        setTimeout(() => {
            setHistory([...history, currentNodeId]);
            setCurrentNodeId(nextId);
            setFade(false);
        }, 300);
    };

    const handleOption = (option) => {
        if (playSound) playSound('click');
        transitionTo(option.next);
    };

    const handleRestart = () => {
        setFade(true);
        setTimeout(() => {
            setCurrentNodeId(scenario.startNode);
            setHistory([]);
            setFade(false);
        }, 300);
    };

    return (
        <div className="max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden min-h-[650px] flex flex-col relative shadow-2xl bg-white border border-slate-100">
            {/* Background elements */}
            <div className="absolute top-0 w-full h-64 bg-violet-700 z-0"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob hover:scale-110 transition-transform duration-[10s]"></div>
            <div className="absolute -top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            {/* Header */}
            <div className="relative z-10 p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all backdrop-blur-md active:scale-95 border border-white/10 shadow-lg"
                    >
                        <ArrowLeft />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1 opacity-90 text-[10px] font-extrabold uppercase tracking-widest bg-violet-800/50 inline-block px-2 py-1 rounded-lg backdrop-blur-sm border border-violet-500/30">
                            <MessageSquare size={10} /> {t?.game?.roleplay?.interactive || "Simulación Interactiva"}
                        </div>
                        <h2 className="text-3xl font-black tracking-tight drop-shadow-md">{scenario.title}</h2>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative z-10 flex flex-col px-4 pb-8 -mt-4">
                <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col">

                    {/* Scenario Card */}
                    <div className={`
                         bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-xl border border-white/50 flex-1 flex flex-col items-center justify-center text-center transition-all duration-300 ease-out transform
                         ${fade ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
                    `}>
                        {/* Status Icon */}
                        <div className="mb-8 relative">
                            <div className={`absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse ${currentNode.isFailure ? 'bg-red-500' :
                                currentNode.isSuccess ? 'bg-green-500' : 'bg-violet-500'
                                }`}></div>

                            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ${currentNode.isFailure ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-500' :
                                currentNode.isSuccess ? 'bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-500' :
                                    'bg-gradient-to-br from-violet-50 to-indigo-100 text-violet-600'
                                }`}>
                                {currentNode.isFailure ? <XCircle size={48} /> :
                                    currentNode.isSuccess ? <CheckCircle2 size={48} /> :
                                        <Activity size={48} />}
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-6 max-w-xl">
                            <h3 className="text-2xl md:text-3xl text-slate-800 font-bold leading-snug">
                                {currentNode.text}
                            </h3>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => { if (playSound) playSound('click'); window.speechSynthesis.speak(new SpeechSynthesisUtterance(currentNode.text)); }}
                                    className="flex items-center text-xs font-bold text-violet-600 bg-violet-50 px-4 py-2 rounded-full hover:bg-violet-100 transition-colors border border-violet-100 uppercase tracking-wider"
                                >
                                    <Volume2 size={14} className="mr-2" /> {t?.game?.roleplay?.listen || "Escuchar Narración"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Options / Action Area */}
                    <div className={`mt-6 w-full max-w-xl mx-auto space-y-4 transition-all duration-300 delay-100 ${fade ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                        {currentNode.options && currentNode.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOption(opt)}
                                className="w-full text-left p-6 bg-white border-2 border-slate-100 hover:border-violet-500 hover:bg-violet-50/50 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 group flex items-center justify-between relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <span className="text-lg font-bold text-slate-700 group-hover:text-violet-900 transition-colors">{opt.text}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 group-hover:bg-violet-500 group-hover:border-violet-500 flex items-center justify-center transition-all transform group-hover:scale-110 group-active:scale-95 shadow-sm">
                                    <ArrowRight size={20} className="text-slate-400 group-hover:text-white" />
                                </div>
                            </button>
                        ))}

                        {currentNode.isFailure && (
                            <div className="animate-in zoom-in duration-300">
                                <div className="text-red-600 font-medium mb-4 flex items-center justify-center p-4 bg-red-50 rounded-2xl border border-red-100 text-sm">
                                    <ThumbsDown className="mr-2" size={18} />
                                    <span>{t?.game?.roleplay?.failure || "Decisión incorrecta. Analiza qué falló y reintenta."}</span>
                                </div>
                                <button
                                    onClick={() => { if (playSound) playSound('click'); handleRestart(); }}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={18} /> {t?.game?.roleplay?.retry || "Intentar de nuevo"}
                                </button>
                            </div>
                        )}

                        {currentNode.isSuccess && (
                            <div className="animate-in zoom-in duration-300">
                                <div className="text-emerald-700 font-medium mb-4 flex items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm">
                                    <ThumbsUp className="mr-2" size={18} />
                                    <span>{t?.game?.roleplay?.success || "¡Excelente actuación! Situación controlada."}</span>
                                </div>
                                <button
                                    onClick={() => { if (playSound) playSound('success'); onComplete(); }}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-2xl transform hover:-translate-y-1 active:scale-[0.98]"
                                >
                                    {t?.game?.roleplay?.complete || "Completar Módulo"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleplayGame;
