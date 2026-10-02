import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Volume2, CheckCircle2, ChevronRight, Brain, Lightbulb, AlertOctagon, XCircle, Award } from 'lucide-react';
import { RcpGame, BotiquinGame, HeimlichGame, Chat112Game, SequenceGame, TriageGame } from '../games/MiniGames';
import CPRHero from '../games/CPRHero';

const PASS_THRESHOLD = 0.7;

const SpeakButton = ({ text, playSound, language = 'es-ES' }) => {
    const speak = (e) => {
        e.stopPropagation();
        if (playSound) playSound('click');
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = language || 'es-ES';
        window.speechSynthesis.speak(u);
    };
    return <button onClick={speak} className="text-slate-400 hover:text-brand-600 p-2 rounded-full hover:bg-brand-50 ml-2 transition-colors active:scale-95"><Volume2 size={24} /></button>;
};

const LearningModule = ({ module, t, onComplete, onBack, playSound, questions = [] }) => {
    const [step, setStep] = useState(0);
    const [gameDone, setGameDone] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [quizStep, setQuizStep] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizPassed, setQuizPassed] = useState(false);

    useEffect(() => setGameDone(false), [step]);

    if (!module?.content?.steps) return <div>{t?.common?.errorContent || "Error: Contenido no encontrado"}</div>;

    const currentContent = module.content.steps[step];
    const isGameStep = !!currentContent.interactiveComponent;
    const canAdvance = !isGameStep || gameDone;
    const hasQuestions = questions.length > 0;
    const totalSteps = module.content.steps.length + (hasQuestions ? 1 : 0);

    const next = () => {
        if (playSound) playSound('click');
        if (step < totalSteps - 1) setStep(s => s + 1);
        else onComplete();
    };

    const progressPercentage = ((step + 1) / totalSteps) * 100;

    const startQuiz = () => {
        setQuizActive(true);
        setQuizStep(0);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
        setQuizPassed(false);
    };

    const selectAnswer = (qId, optionIdx) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    const submitQuiz = () => {
        const correct = questions.reduce((acc, q) => acc + (quizAnswers[q.id] === q.a ? 1 : 0), 0);
        const total = questions.length;
        const score = total > 0 ? correct / total : 0;
        setQuizScore(correct);
        setQuizSubmitted(true);
        setQuizPassed(score >= PASS_THRESHOLD);
        if (playSound) playSound(score >= PASS_THRESHOLD ? 'success' : 'error');
    };

    const finishModule = () => {
        if (playSound) playSound('click');
        onComplete();
    };

    if (quizActive) {
        const currentQuestion = questions[quizStep];
        const answeredCount = Object.keys(quizAnswers).length;
        const isLastQuestion = quizStep >= questions.length - 1;
        const allAnswered = answeredCount >= questions.length;
        const nextQuiz = () => {
            if (playSound) playSound('click');
            if (quizStep < questions.length - 1) setQuizStep(s => s + 1);
        };

        return (
            <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 font-sans">
                <div className="bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 border-b border-slate-200 shadow-sm z-30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="bg-white border border-slate-200 hover:border-brand-300 text-slate-500 hover:text-brand-600 p-2.5 rounded-xl transition-all shadow-sm active:scale-95">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{t?.module?.quiz || "Test del Módulo"}</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 font-medium">
                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{t?.module?.quizTitle || "EVALUACIÓN"}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{t?.module?.stepCounter ? t.module.stepCounter.replace('{0}', quizStep + 1).replace('{1}', questions.length) : `Pregunta ${quizStep + 1} de ${questions.length}`}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-1 w-48">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(((quizStep + 1) / questions.length) * 100)}% {t?.module?.completed || "Completado"}</div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500 ease-out" style={{ width: `${((quizStep + 1) / questions.length) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col min-h-full">
                        {!quizSubmitted ? (
                            currentQuestion && (
                                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{currentQuestion.category}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">{currentQuestion.q}</h3>
                                        <div className="space-y-3">
                                            {currentQuestion.opts.map((opt, idx) => {
                                                const selected = quizAnswers[currentQuestion.id] === idx;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => selectAnswer(currentQuestion.id, idx)}
                                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-base ${selected ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/50'}`}
                                                    >
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 mr-3 text-sm font-bold flex-shrink-0 ${selected ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300 text-slate-500'}">{String.fromCharCode(65 + idx)}</span>
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-between w-full">
                                        <button onClick={() => setQuizStep(s => Math.max(0, s - 1))} disabled={quizStep === 0} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm">
                                            {t?.common?.back || "Anterior"}
                                        </button>
                                        {isLastQuestion ? (
                                            <button onClick={submitQuiz} disabled={quizAnswers[currentQuestion.id] === undefined} className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${allAnswered ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                                {t?.module?.submitQuiz || "FINALIZAR TEST"}
                                            </button>
                                        ) : (
                                            <button onClick={nextQuiz} disabled={quizAnswers[currentQuestion.id] === undefined} className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${quizAnswers[currentQuestion.id] !== undefined ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                                {t?.common?.continue || "CONTINUAR"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in">
                                <div className={`p-8 md:p-12 rounded-3xl shadow-2xl border text-center max-w-lg w-full ${quizPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className={`inline-flex p-5 rounded-full mb-6 ${quizPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {quizPassed ? <Award size={56} /> : <XCircle size={56} />}
                                    </div>
                                    <h3 className={`text-3xl md:text-4xl font-black mb-3 ${quizPassed ? 'text-green-800' : 'text-red-800'}`}>
                                        {quizPassed ? (t?.module?.passed || "¡APROBADO!") : (t?.module?.failed || "NO APTO")}
                                    </h3>
                                    <p className={`text-lg font-bold mb-6 ${quizPassed ? 'text-green-600' : 'text-red-600'}`}>
                                        {quizScore} / {questions.length} ({Math.round(quizScore / questions.length * 100)}%)
                                    </p>
                                    {quizPassed ? (
                                        <button onClick={finishModule} className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-green-700 transition-all hover:scale-105 active:scale-95">
                                            {t?.common?.finish || "FINALIZAR"}
                                        </button>
                                    ) : (
                                        <button onClick={startQuiz} className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-amber-700 transition-all hover:scale-105 active:scale-95">
                                            {t?.module?.retry || "REINTENTAR"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 font-sans">
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
                            <span>{t?.module?.stepCounter ? t.module.stepCounter.replace('{0}', step + 1).replace('{1}', totalSteps) : `Paso ${step + 1} de ${totalSteps}`}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 w-48">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(progressPercentage)}% {t?.module?.completed || "Completado"}</div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

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

                    {/* Quiz Transition Step */}
                    {step === (hasQuestions ? module.content.steps.length : totalSteps - 1) && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in">
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center max-w-lg w-full">
                                <div className="inline-flex p-5 bg-amber-100 rounded-full text-amber-600 mb-6">
                                    <Brain size={56} />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">{t?.module?.quizReady || "Test de Evaluación"}</h3>
                                <p className="text-slate-600 text-lg mb-2">{t?.module?.quizDesc || "Responde correctamente al menos el 70% de las preguntas para superar este módulo."}</p>
                                <p className="text-slate-400 text-sm mb-8">{questions.length} {t?.module?.questions || "preguntas"}</p>
                                <button onClick={startQuiz} className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-amber-700 transition-all hover:scale-105 active:scale-95">
                                    {t?.module?.startQuiz || "COMENZAR TEST"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Steps */}
                    {step < (hasQuestions ? module.content.steps.length : totalSteps) && (
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
                                    <p className="text-lg md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto px-4 mb-8">
                                        {currentContent.text}
                                    </p>

                                    {currentContent.image && (
                                        <div className="mb-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                            <img src={currentContent.image} alt={currentContent.title} className="w-full h-auto object-cover" />
                                        </div>
                                    )}

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

                                {isGameStep && (
                                    <div className="w-full flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 py-8">
                                        <div className="w-full relative">
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
                    )}

                    <div className="h-32"></div>
                </div>
            </div>

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
                    <span className="hidden md:inline">{step === totalSteps - 1 ? (t?.common?.finish || 'FINALIZAR') : (t?.common?.continue || 'CONTINUAR')}</span>
                    <ChevronRight size={32} strokeWidth={3} className={canAdvance ? 'group-hover:translate-x-1 transition-transform' : ''} />
                </button>
            </div>
        </div>
    );
};

export default LearningModule;
