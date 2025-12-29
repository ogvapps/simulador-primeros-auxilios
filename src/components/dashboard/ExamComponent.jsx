import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Star, ListChecks, ArrowRight, RotateCcw, Zap, Shield } from 'lucide-react';
import { MIN_PASS_SCORE, XP_REWARDS } from '../../data/constants';

const ExamComponent = ({
    questions, t, onComplete, onBack, playSound, attempts = 0,
    currentXp = 0, onUsePowerup, onAnswer, inventory = { powerups: {} },
    practiceMode = false, forceFinish = false
}) => {
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);
    const [rawScore, setRawScore] = useState(0);
    const [finalGrade, setFinalGrade] = useState(0);
    const [isPass, setIsPass] = useState(false);

    // Powerups State
    const [hiddenOptions, setHiddenOptions] = useState({}); // { qIndex: [optIndex1, optIndex2] }
    const [insuranceActive, setInsuranceActive] = useState(false);
    const [xpMultiplier, setXpMultiplier] = useState(1);
    const [skippedQuestions, setSkippedQuestions] = useState(new Set());

    // Progressive Difficulty Logic
    const maxGradeAllowed = Math.max(5, 10 - attempts); // 10, 9, 8, 7, 6, 5...
    const attemptsLeft = Math.max(0, 5 - attempts);

    if (!questions || questions.length === 0) return <div>{t?.common?.loading || "Cargando..."}</div>;

    useEffect(() => {
        if (forceFinish && !finished) {
            finish();
        }
    }, [forceFinish]);

    const handleSelect = (opt) => {
        if (playSound) playSound('click');
        setAnswers(prev => ({ ...prev, [qIndex]: opt }));

        // Real-time streak reporting
        if (onAnswer && !answers[qIndex]) {
            const isCorrect = opt === questions[qIndex].a;
            onAnswer(isCorrect);
        }
    };

    const handleUse5050 = () => {
        if (hiddenOptions[qIndex]) return;
        const count = inventory.powerups?.lucky || 0;

        if (count > 0) {
            if (onUsePowerup) onUsePowerup('lucky', 0);
        } else if (currentXp >= 200) {
            if (onUsePowerup) onUsePowerup('lucky', 200);
        } else return;

        if (playSound) playSound('powerup');
        const currentQ = questions[qIndex];
        const options = currentQ.opts || currentQ.options;
        const correctOpt = currentQ.a;
        const correctIndex = options.findIndex(o => o === correctOpt);
        const wrongOpts = options.map((_, i) => i).filter(i => i !== correctIndex);
        const shuffled = wrongOpts.sort(() => 0.5 - Math.random());
        setHiddenOptions(prev => ({ ...prev, [qIndex]: shuffled.slice(0, 2) }));
    };

    const handleUseInsurance = () => {
        if (insuranceActive) return;
        const count = inventory.powerups?.shield || 0;

        if (count > 0) {
            if (onUsePowerup) onUsePowerup('shield', 0);
        } else if (currentXp >= 500) {
            if (onUsePowerup) onUsePowerup('shield', 500);
        } else return;

        if (playSound) playSound('powerup');
        setInsuranceActive(true);
    };

    const handleUseDoubleXp = () => {
        if (xpMultiplier > 1) return;
        const count = inventory.powerups?.double_xp || 0;

        if (count > 0) {
            if (onUsePowerup) onUsePowerup('double_xp', 0);
        } else if (currentXp >= 300) {
            if (onUsePowerup) onUsePowerup('double_xp', 300);
        } else return;

        if (playSound) playSound('powerup');
        setXpMultiplier(2);
    };

    const handleSkipQuestion = () => {
        if (answers[qIndex] || skippedQuestions.has(qIndex)) return;
        const count = inventory.powerups?.skip_question || 0;

        if (count > 0) {
            if (onUsePowerup) onUsePowerup('skip_question', 0);
        } else if (currentXp >= 150) {
            if (onUsePowerup) onUsePowerup('skip_question', 150);
        } else return;

        if (playSound) playSound('powerup');
        setSkippedQuestions(prev => new Set(prev).add(qIndex));
        setAnswers(prev => ({ ...prev, [qIndex]: questions[qIndex].a })); // Auto-correct
        if (onAnswer) onAnswer(true); // Don't break streak
    };

    const finish = () => {
        let s = 0;
        const fullExam = questions;
        fullExam.forEach((q, i) => { if (answers[i] === q.a) s++; });

        setRawScore(s);

        // Calculate Grade 0-10
        const baseGrade = (s / questions.length) * 10;
        const grade = Math.min(baseGrade, maxGradeAllowed);
        setFinalGrade(grade);

        const passed = grade >= 5;
        setIsPass(passed);

        setFinished(true);

        if (passed) { if (playSound) playSound('fanfare'); }
        else { if (playSound) playSound('error'); }

        // Pass RAW score to App (skip in practice mode)
        if (!practiceMode && onComplete) {
            onComplete(s, passed, answers, insuranceActive, xpMultiplier);
        }
    };

    if (finished) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="bg-white p-6 md:p-12 rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-100 animate-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        {isPass ? (
                            <div className="mb-6 relative inline-block">
                                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <CheckCircle2 size={100} className="relative z-10 text-green-500 mx-auto animate-bounce" />
                            </div>
                        ) : (
                            <div className="mb-6">
                                <XCircle size={100} className="text-red-500 mx-auto animate-pulse" />
                            </div>
                        )}
                        <h2 className="text-5xl font-black mb-4 text-slate-900 tracking-tight">{isPass ? (t?.exam?.congrats || '¡ENHORABUENA!') : (t?.exam?.retry || 'VUELVE A INTENTARLO')}</h2>

                        <div className="flex justify-center gap-8 mb-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{t?.exam?.hits || "Aciertos"}</p>
                                <p className="text-3xl font-black text-slate-800">{rawScore} <span className="text-lg text-slate-400">/ {questions.length}</span></p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{t?.exam?.grade || "Nota Final"}</p>
                                <p className={`text-5xl font-black ${isPass ? 'text-green-600' : 'text-red-500'}`}>{finalGrade.toFixed(1)}</p>
                            </div>
                        </div>

                        {!isPass && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
                                <p className="font-bold">{t?.exam?.minGrade || "Nota mínima para aprobar: 5.0"}</p>
                                <p className="text-sm mt-1">{t?.exam?.maxGrade || "Tu nota máxima posible en este intento era:"} <span className="font-black">{maxGradeAllowed}</span></p>
                                <p className="text-xs mt-2 text-red-500 uppercase tracking-widest font-bold">{t?.exam?.attemptsLeft ? t.exam.attemptsLeft.replace('{0}', Math.max(0, attemptsLeft - 1)) : `Te quedan ${Math.max(0, attemptsLeft - 1)} intentos`}</p>
                            </div>
                        )}

                        {isPass && (
                            <div className="mt-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-yellow-800 font-bold inline-flex items-center shadow-lg transform hover:scale-105 transition-transform">
                                <Star className="mr-3 text-yellow-500 fill-yellow-500" size={32} />
                                <span className="text-xl">{t?.exam?.passed || "¡EXAMEN SUPERADO!"}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-10 bg-slate-50 rounded-2xl p-6 border border-slate-200 max-h-96 overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center">
                            <ListChecks className="mr-3 text-brand-500" /> {t?.exam?.review || "Revisión de Resultados"}
                        </h3>
                        <div className="space-y-4">
                            {questions.map((q, i) => {
                                const isCorrect = answers[i] === q.a;
                                return (
                                    <div key={i} className={`p-5 rounded-xl border-l-8 shadow-sm bg-white ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-bold text-slate-800 text-base">{i + 1}. {q.q}</p>
                                            {isCorrect ? <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" /> : <XCircle size={24} className="text-red-500 flex-shrink-0" />}
                                        </div>
                                        <div className="text-sm pl-4 border-l-2 border-slate-100 ml-1">
                                            <p className={`mb-1 font-medium ${isCorrect ? 'text-green-700' : 'text-red-600 line-through opacity-70'}`}>
                                                {t?.exam?.yourAnswer || "Tu respuesta"}: {answers[i]}
                                            </p>
                                            {!isCorrect && (<p className="text-green-700 font-bold mb-2">{t?.exam?.correctAnswer || "Correcta"}: {q.a}</p>)}
                                            <p className="text-slate-500 text-xs italic mt-2 bg-slate-50 p-2 rounded-lg">💡 {q.expl}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button onClick={onBack} className="bg-slate-800 text-white px-10 py-4 rounded-xl hover:bg-slate-900 shadow-xl font-bold text-lg transition-all hover:-translate-y-1">
                            {t?.exam?.backHome || "Volver al Inicio"}
                        </button>
                        {!isPass && attemptsLeft > 1 && (
                            <button onClick={() => { setFinished(false); setQIndex(0); setAnswers({}); setRawScore(0); }} className="bg-brand-600 text-white px-10 py-4 rounded-xl hover:bg-brand-700 shadow-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center">
                                <RotateCcw className="mr-2" /> {t?.exam?.retryButton ? t.exam.retryButton.replace('{0}', attemptsLeft - 1) : `Reintentar (${attemptsLeft - 1} restantes)`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[qIndex];
    const isLast = qIndex === questions.length - 1;
    const progress = ((qIndex + 1) / questions.length) * 100;
    const options = question.opts || question.options;

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-[700px]">

                {/* Practice Mode Banner */}
                {practiceMode && (
                    <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-xl text-center animate-pulse">
                        <p className="font-black text-blue-700 text-sm">🎯 PRACTICE MODE - Results won't be saved</p>
                    </div>
                )}

                {/* Shop / Header */}
                <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-2 min-w-max">
                        <button
                            onClick={handleUse5050}
                            disabled={hiddenOptions[qIndex] || (inventory.powerups?.lucky <= 0 && currentXp < 200)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${hiddenOptions[qIndex] ? 'bg-slate-100 text-slate-400' : (inventory.powerups?.lucky > 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 border-indigo-200 text-indigo-700')}`}
                        >
                            <Zap size={12} /> {inventory.powerups?.lucky > 0 ? `50/50 (${inventory.powerups.lucky})` : "50/50 (200 XP)"}
                        </button>
                        <button
                            onClick={handleUseInsurance}
                            disabled={insuranceActive || (inventory.powerups?.shield <= 0 && currentXp < 500)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${insuranceActive ? 'bg-emerald-600 text-white border-emerald-600' : (inventory.powerups?.shield > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700')}`}
                        >
                            <Shield size={12} /> {insuranceActive ? 'Seguro ON' : (inventory.powerups?.shield > 0 ? `Seguro (${inventory.powerups.shield})` : "Seguro (500 XP)")}
                        </button>
                        <button
                            onClick={handleUseDoubleXp}
                            disabled={xpMultiplier > 1 || (inventory.powerups?.double_xp <= 0 && currentXp < 300)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${xpMultiplier > 1 ? 'bg-yellow-500 text-white border-yellow-500 animate-pulse' : (inventory.powerups?.double_xp > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700')}`}
                        >
                            <Star size={12} /> {xpMultiplier > 1 ? '2x XP ON' : (inventory.powerups?.double_xp > 0 ? `2x XP (${inventory.powerups.double_xp})` : "2x XP (300 XP)")}
                        </button>
                        <button
                            onClick={handleSkipQuestion}
                            disabled={answers[qIndex] || skippedQuestions.has(qIndex) || (inventory.powerups?.skip_question <= 0 && currentXp < 150)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${skippedQuestions.has(qIndex) ? 'bg-slate-100 text-slate-400' : (inventory.powerups?.skip_question > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700')}`}
                        >
                            <ArrowRight size={12} /> {skippedQuestions.has(qIndex) ? 'Saltada' : (inventory.powerups?.skip_question > 0 ? `Saltar (${inventory.powerups.skip_question})` : "Saltar (150 XP)")}
                        </button>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{t?.exam?.questionCounter ? t.exam.questionCounter.replace('{0}', qIndex + 1).replace('{1}', questions.length) : `Pregunta ${qIndex + 1} / ${questions.length}`}</span>
                        <span className="text-xs font-black text-yellow-500">{currentXp} XP</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-slate-100 rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                </div>

                {/* Question */}
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 leading-snug">{question.q}</h3>

                    <div className="space-y-3">
                        {options.map((opt, idx) => {
                            // 50/50 Logic: Hide if index is in hiddenOptions[qIndex]
                            if (hiddenOptions[qIndex]?.includes(idx)) {
                                return (
                                    <div key={opt} className="w-full p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-300 flex items-center justify-center opacity-50">
                                        <XCircle size={20} />
                                    </div>
                                );
                            }

                            // Feedback State Logic
                            const isAnswered = answers[qIndex] !== undefined;
                            const isSelected = answers[qIndex] === opt;
                            const isCorrect = opt === question.a;

                            let feedbackClass = 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-600';

                            if (isAnswered) {
                                if (isCorrect) feedbackClass = 'bg-green-100 border-green-500 text-green-800 font-bold';
                                else if (isSelected) feedbackClass = 'bg-red-100 border-red-500 text-red-800 opacity-60';
                                else feedbackClass = 'opacity-50 blur-[1px]';
                            } else if (isSelected) {
                                // Should not happen if we disable after answer, but good fallback
                                feedbackClass = 'border-brand-500 bg-brand-50 text-brand-800';
                            }

                            return (
                                <button
                                    key={opt}
                                    onClick={() => !isAnswered && handleSelect(opt)}
                                    disabled={isAnswered}
                                    className={`
                            w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 font-bold text-lg flex items-center justify-between
                            ${feedbackClass}
                        `}
                                >
                                    <span className="flex-1 pr-2">{opt}</span>
                                    {isAnswered && isCorrect && <CheckCircle2 size={24} className="text-green-600" />}
                                    {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-red-600" />}
                                </button>
                            )
                        })}
                    </div>

                    {/* Immediate Explanation Feedback */}
                    {answers[qIndex] && (
                        <div className={`mt-6 p-4 rounded-xl border-l-4 animate-in slide-in-from-bottom-2 ${answers[qIndex] === question.a ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                            <div className="font-bold flex items-center gap-2 mb-2">
                                {answers[qIndex] === question.a ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                {answers[qIndex] === question.a ? (t?.exam?.correct || "¡Correcto!") : (t?.exam?.wrong || "Incorrecto")}
                            </div>
                            <p className="text-sm opacity-90">{question.expl}</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                    <button
                        onClick={() => setQIndex(i => i - 1)}
                        disabled={qIndex === 0} // Allow going back to review
                        className="text-slate-400 font-bold hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors px-4 py-2"
                    >
                        {t?.common?.prev || "Anterior"}
                    </button>

                    {isLast ? (
                        <button
                            onClick={finish}
                            disabled={!answers[qIndex]}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200 transition-all hover:scale-105"
                        >
                            {t?.exam?.finish || "Finalizar Examen"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setQIndex(i => i + 1)}
                            disabled={!answers[qIndex]}
                            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200 transition-all hover:scale-105 flex items-center"
                        >
                            {t?.common?.next || "Siguiente"} <ArrowRight className="ml-2" size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamComponent;
