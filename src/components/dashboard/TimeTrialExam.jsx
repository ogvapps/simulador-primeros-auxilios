import React, { useState, useEffect } from 'react';
import { Timer, Zap, CheckCircle2, XCircle, Trophy } from 'lucide-react';
// Validate imports if necessary, assuming constants are passed or we can import them as fallback
// import { EXAM_QUESTIONS_ES } from '../../data/constants';

const TimeTrialExam = ({ questions, t, onComplete, onBack, playSound }) => {
    // Game State: 'intro', 'playing', 'finished'
    const [gameState, setGameState] = useState('intro');

    const [localQuestions, setLocalQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Initial Setup: Pick 10 random questions
    useEffect(() => {
        if (questions && questions.length > 0) {
            const shuffled = [...questions].sort(() => 0.5 - Math.random());
            setLocalQuestions(shuffled.slice(0, 10));
        }
    }, [questions]);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (gameState === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleFinish();
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    const [clickCount, setClickCount] = useState(0);

    const handleStart = () => {
        setClickCount(c => c + 1);
        try {
            if (playSound) playSound('click');
        } catch (e) {
            console.error("Audio error", e);
        }
        setGameState('playing');
    };

    const handleAnswer = (optionIndex) => {
        if (selectedAnswer !== null) return; // Block multiple clicks
        setSelectedAnswer(optionIndex);

        const currentQ = localQuestions[currentIndex];
        // Fix for 'a' (string) vs 'correct' (index)
        const isCorrect = currentQ.a
            ? currentQ.opts[optionIndex] === currentQ.a
            : optionIndex === currentQ.correct;

        if (isCorrect) {
            try { if (playSound) playSound('success'); } catch (e) { }
            setScore(s => s + 1);
        } else {
            try { if (playSound) playSound('error'); } catch (e) { }
            setTimeLeft(t => Math.max(0, t - 5)); // -5 seconds penalty
        }

        setTimeout(() => {
            if (currentIndex < localQuestions.length - 1) {
                setCurrentIndex(i => i + 1);
                setSelectedAnswer(null);
            } else {
                handleFinish();
            }
        }, 500);
    };

    const handleFinish = () => {
        setGameState('finished');
        try { if (playSound) playSound('fanfare'); } catch (e) { }
    };

    const handleExit = () => {
        const bonus = Math.max(0, Math.floor(timeLeft / 2));
        const totalXp = (score * 20) + bonus;
        onComplete(totalXp);
    }

    // --- RENDER HELPERS ---

    useEffect(() => {
        // AGGRESSIVE DEBUGGING
        alert(`DEBUG v1.6 LOADED`);
    }, []);

    if (gameState === 'intro') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
                <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 text-center border-4 border-yellow-500 shadow-2xl relative overflow-hidden">
                    {/* Decorative Background - Added pointer-events-none to prevent click blocking */}
                    <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/10 animate-pulse pointer-events-none"></div>

                    {/* Content Wrapper to ensure Z-Index above background */}
                    <div className="relative z-10">
                        <Zap className="mx-auto text-yellow-500 mb-6 animate-bounce" size={64} />
                        <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">{t?.game?.timetrial?.title || "Contrarreloj"}</h1>
                        <p className="text-slate-400 mb-8 text-lg">
                            {t?.game?.timetrial?.subtitle || "10 Preguntas. 60 Segundos."}<br />
                            <span className="text-red-400 font-bold">{t?.game?.timetrial?.penalty || "Fallar resta 5 segundos."}</span>
                        </p>

                        {localQuestions.length > 0 ? (
                            <button
                                type="button"
                                onClick={handleStart}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xl py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:scale-105 transition-all active:scale-95"
                            >
                                {t?.game?.timetrial?.start || "¡EMPEZAR YA!"}
                            </button>
                        ) : (
                            <div className="p-4 bg-slate-700 rounded-xl text-slate-300">
                                <p className="animate-pulse">Cargando preguntas...</p>
                            </div>
                        )}

                        <button onClick={onBack} className="mt-4 text-slate-500 hover:text-white underline">{t?.game?.timetrial?.back || "Volver"}</button>

                        {/* DEBUGGER FOR USER FEEDBACK */}
                        <div className="mt-6 p-2 bg-red-900/50 border border-red-500 rounded text-xs text-white font-mono font-bold">
                            DEBUG: v1.6 | Q: {localQuestions?.length || 0} | S: {gameState} | C: {clickCount}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
                <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 text-center border border-slate-700 shadow-2xl">
                    <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
                    <h2 className="text-3xl font-black mb-2">{t?.game?.timetrial?.timeUp || "¡Tiempo Agotado!"}</h2>
                    <div className="text-6xl font-black text-white mb-2">{score}/10</div>
                    <p className="text-slate-400 mb-6">{t?.game?.timetrial?.hits || "Aciertos"}</p>

                    <div className="bg-slate-700/50 rounded-xl p-4 mb-8 flex justify-between items-center">
                        <span className="text-slate-400">{t?.game?.timetrial?.bonus || "Bonus Tiempo"}:</span>
                        <span className="font-bold text-green-400">+{Math.floor(timeLeft / 2)} XP</span>
                    </div>

                    <button
                        onClick={handleExit}
                        className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        {t?.game?.timetrial?.returnMenu || "Volver al Menú"}
                    </button>
                </div>
            </div>
        );
    }

    // PLAYING STATE
    const currentQ = localQuestions[currentIndex];

    // Safety check: if playing but no question, error or finish
    if (!currentQ) {
        return <div className="p-10 text-white text-center">Error: Pregunta no encontrada. <button onClick={onBack}>Volver</button></div>;
    }

    const options = currentQ.opts || currentQ.options;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-2xl w-full z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold">{t?.game?.timetrial?.question || "PREGUNTA"}</span>
                        <span className="text-2xl font-black text-white">{currentIndex + 1}<span className="text-slate-600 text-lg">/{localQuestions.length}</span></span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xl border-2 ${timeLeft < 10 ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-white'}`}>
                        <Timer size={24} />
                        {timeLeft}s
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-700 mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-6">
                        {currentQ.q || currentQ.question}
                    </h3>

                    <div className="grid gap-3">
                        {options.map((opt, idx) => {
                            let status = 'neutral';
                            if (selectedAnswer !== null) {
                                // Correction check
                                const isCorrect = currentQ.a
                                    ? opt === currentQ.a
                                    : idx === currentQ.correct;

                                if (isCorrect) status = 'correct';
                                else if (idx === selectedAnswer) status = 'wrong';
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selectedAnswer !== null}
                                    className={`
                                        w-full p-4 rounded-xl text-left font-medium transition-all transform duration-200 flex items-center justify-between
                                        ${status === 'neutral' ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 hover:scale-[1.02]' : ''}
                                        ${status === 'correct' ? 'bg-green-500 text-white ring-4 ring-green-500/30 font-bold' : ''}
                                        ${status === 'wrong' ? 'bg-red-500 text-white opacity-50' : ''}
                                    `}
                                >
                                    <span>{opt}</span>
                                    {status === 'correct' && <CheckCircle2 size={24} />}
                                    {status === 'wrong' && <XCircle size={24} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeTrialExam;
