import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Volume2, CheckCircle2, ChevronRight, Brain, Lightbulb, AlertOctagon } from 'lucide-react';
import { RcpGame, BotiquinGame, HeimlichGame, Chat112Game, SequenceGame, TriageGame } from '../games/MiniGames';
import CPRHero from '../games/CPRHero';

const SpeakButton = ({ text, playSound, language = 'es-ES' }) => {
    const speak = (e) => {
        e.stopPropagation();
        if (playSound) playSound('click');
        if (!text || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        // Detect language from text or use passed prop? 
        // Ideally we should use the App's language state, but here we can defaults to mixed.
        // Assuming we want to read the text in the language it is displayed.
        // For now, default to 'es-ES' if not specified, but we should make this dynamic in future.
        // Note: The text itself is translated, so setting 'es-ES' for English text might sound weird.
        // We cannot easily pass 'lang' prop deep down unless we change everything properly.
        // Simplification: Auto-detect or assume ES for now, but really we should use the 'lang' prop from App if we had it.
        // However, 'text' is localized, so if text is English, we should use 'en-US'.
        // We can guess:
        const isEnglish = /[a-zA-Z]/.test(text) && !/[áéíóúñ]/.test(text); // Very rough heuristic
        u.lang = isEnglish ? 'en-US' : 'es-ES';

        window.speechSynthesis.speak(u);
    };
    return <button onClick={speak} className="text-slate-400 hover:text-brand-600 p-2 rounded-full hover:bg-brand-50 ml-2 transition-colors active:scale-95"><Volume2 size={24} /></button>;
};

const LearningModule = ({ module, t, onComplete, onBack, playSound }) => {
    const [step, setStep] = useState(0);
    const [gameDone, setGameDone] = useState(false);

    // ensure module.content exists
    if (!module?.content?.steps) return <div>{t?.common?.errorContent || "Error: Contenido no encontrado"}</div>;

    const currentContent = module.content.steps[step];
    const isGameStep = !!currentContent.interactiveComponent;
    const canAdvance = !isGameStep || gameDone;

    useEffect(() => setGameDone(false), [step]);

    const next = () => {
        if (playSound) playSound('click');
        if (step < module.content.steps.length - 1) setStep(s => s + 1);
        else onComplete();
    };

    const progressPercentage = ((step + 1) / module.content.steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 font-sans">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 border-b border-slate-200 shadow-sm z-30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="bg-white border border-slate-200 hover:border-brand-300 text-slate-500 hover:text-brand-600 p-2.5 rounded-xl transition-all shadow-sm active:scale-95">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{module.title}</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-medium">
                            <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{t?.module?.moduleTitle ? t.module.moduleTitle.replace('{id}', module.id.toUpperCase()) : `Módulo ${module.id.toUpperCase()}`}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{t?.module?.stepCounter ? t.module.stepCounter.replace('{0}', step + 1).replace('{1}', module.content.steps.length) : `Paso ${step + 1} de ${module.content.steps.length}`}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="hidden md:flex flex-col items-end gap-1 w-48">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(progressPercentage)}% {t?.module?.completed || "Completado"}</div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col min-h-full">

                    {/* Video Embed */}
                    {module.content.videoUrls && module.content.videoUrls.length > 0 && step === 0 && (
                        <div className="mb-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-1">
                                <div className="bg-slate-50 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                    <div className="p-4 bg-red-100 rounded-full text-red-600 animate-pulse ring-4 ring-red-50">
                                        <ExternalLink size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{t?.module?.videoTitle || "Material Audiovisual Recomendado"}</h4>
                                        <p className="text-slate-500 text-sm mb-4">{t?.module?.videoDesc || "Complementa tu aprendizaje viendo estos vídeos explicativos."}</p>
                                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                            {module.content.videoUrls.map((url, idx) => (
                                                <a key={idx} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 transform hover:-translate-y-0.5">
                                                    <Volume2 className="mr-2" size={16} /> {t?.module?.watchVideo ? t.module.watchVideo.replace('{0}', idx + 1) : `Ver Vídeo ${idx + 1}`}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Card */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className={`transition-all duration-500 w-full max-w-5xl mx-auto ${isGameStep ? 'flex-1 flex flex-col' : ''}`}>

                            <div className="text-center mb-8 relative z-10">
                                <div className="inline-flex p-5 mb-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in duration-300">
                                    <div className="transform hover:rotate-12 transition-transform duration-300 text-brand-600">
                                        {React.cloneElement(currentContent.icon, { size: 56 })}
                                    </div>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4 drop-shadow-sm px-4">
                                    {currentContent.title}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <SpeakButton text={`${currentContent.title}. ${currentContent.text}`} playSound={playSound} />
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t?.module?.listen || "Escuchar"}</span>
                                </div>
                                {/* Main Text */}
                                <p className="text-lg md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto px-4 mb-8">
                                    {currentContent.text}
                                </p>

                                {/* Optional Image */}
                                {currentContent.image && (
                                    <div className="mb-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                        <img src={currentContent.image} alt={currentContent.title} className="w-full h-auto object-cover" />
                                    </div>
                                )}

                                {/* "Saber Más" Section */}
                                {currentContent.saberMas && (
                                    <div className="max-w-3xl mx-auto px-4 mb-8 w-full">
                                        <details className="group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 open:shadow-md open:border-brand-200">
                                            <summary className="flex items-center justify-between p-4 cursor-pointer select-none bg-slate-50 group-open:bg-brand-50 transition-colors">
                                                <div className="flex items-center gap-3 font-bold text-slate-700 group-open:text-brand-700">
                                                    <div className="bg-brand-100 text-brand-600 p-1.5 rounded-lg group-open:bg-brand-200">
                                                        <Brain size={20} />
                                                    </div>
                                                    <span>{t?.module?.knowMore || "Saber Más"}</span>
                                                </div>
                                                <div className="transform transition-transform duration-300 group-open:rotate-180 text-slate-400 group-open:text-brand-500">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </summary>
                                            <div className="p-6 text-left text-slate-600 leading-relaxed border-t border-slate-100 bg-white animate-in slide-in-from-top-2">
                                                {currentContent.saberMas}
                                            </div>
                                        </details>
                                    </div>
                                )}


                                {/* --- EDUCATIONAL EXTRAS (New) --- */}
                                <div className="grid grid-cols-1 gap-4 w-full max-w-4xl mx-auto px-4 mt-2 text-left">
                                    {currentContent.why && (
                                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-1 text-indigo-700 font-black uppercase text-xs tracking-wider">
                                                <Brain size={16} /> {t?.module?.why || "Fisiología: ¿Por qué funciona?"}
                                            </div>
                                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{currentContent.why}</p>
                                        </div>
                                    )}
                                    {currentContent.tip && (
                                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-1 text-emerald-700 font-black uppercase text-xs tracking-wider">
                                                <Lightbulb size={16} /> {t?.module?.tip || "Consejo Pro"}
                                            </div>
                                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{currentContent.tip}</p>
                                        </div>
                                    )}
                                    {currentContent.warning && (
                                        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm">
                                            <div className="flex items-center gap-2 mb-1 text-rose-700 font-black uppercase text-xs tracking-wider">
                                                <AlertOctagon size={16} /> {t?.module?.warning || "Error Común"}
                                            </div>
                                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{currentContent.warning}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Interactive Component Container */}
                            {isGameStep && (
                                <div className="w-full flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 py-8">
                                    <div className="w-full relative">
                                        {/* Specific styling for Chat112 and vertical games to allow scroll or fit */}
                                        <div className={`flex justify-center ${currentContent.interactiveComponent === 'Chat112Game' ? 'pb-20' : ''}`}>
                                            {currentContent.interactiveComponent === 'RcpGame' && <RcpGame onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'BotiquinGame' && <BotiquinGame onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'HeimlichGame' && <HeimlichGame onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'SequenceGame_PAS' && <SequenceGame onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'Chat112Game' && <Chat112Game onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'TriageGame' && <TriageGame onComplete={() => setGameDone(true)} playSound={playSound} />}
                                            {currentContent.interactiveComponent === 'CPRHero' && <CPRHero onComplete={() => setGameDone(true)} />}
                                        </div>
                                    </div>

                                    {gameDone && (
                                        <div className="mt-8 animate-bounce bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold shadow-lg ring-4 ring-green-50 flex items-center gap-2 transform hover:scale-105 transition-transform cursor-default select-none">
                                            <CheckCircle2 size={24} />
                                            {t?.module?.activityCompleted || "¡ACTIVIDAD COMPLETADA!"}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Padding bottom for FAB */}
                    <div className="h-32"></div>
                </div>
            </div>

            {/* Floating Action Button (Next) */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-50">
                <button
                    onClick={next}
                    disabled={!canAdvance}
                    className={`
                        group flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all duration-300
                        ${canAdvance
                            ? 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 hover:shadow-brand-500/40 active:scale-95 cursor-pointer ring-4 ring-white/50'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
                    `}
                >
                    <span className="hidden md:inline">{step === module.content.steps.length - 1 ? (t?.common?.finish || 'FINALIZAR') : (t?.common?.continue || 'CONTINUAR')}</span>
                    <ChevronRight size={32} strokeWidth={3} className={canAdvance ? 'group-hover:translate-x-1 transition-transform' : ''} />
                </button>
            </div>
        </div>
    );
};

export default LearningModule;
