import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, RefreshCw, Trophy, Activity } from 'lucide-react';

const TARGET_BPM_MIN = 100;
const TARGET_BPM_MAX = 120;

const CPRHero = ({ onComplete }) => {
    const [started, setStarted] = useState(false);
    const [bpm, setBpm] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('Pulsa ESPACIO o haz CLIC al ritmo (100-120 BPM)');
    const [feedbackColor, setFeedbackColor] = useState('text-slate-500');
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameWon, setGameWon] = useState(false);

    const lastTapRef = useRef(0);
    const tapsRef = useRef([]); // Store timestamps of last few taps for smoothing
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (started && !gameWon) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishGame(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [started, gameWon]);

    const finishGame = (win) => {
        clearInterval(timerRef.current);
        setStarted(false);
        setGameWon(win);
        if (win) {
            setFeedback('¡HEROICO! Has mantenido el ritmo vital.');
            setFeedbackColor('text-green-600');
            setTimeout(() => onComplete && onComplete(true), 1500);
        } else {
            setFeedback('Tiempo agotado. Inténtalo de nuevo.');
            setFeedbackColor('text-red-500');
        }
    };

    const handleTap = (e) => {
        if (gameWon) return;
        if (e.type === 'keydown' && e.code !== 'Space') return;
        if (e.type === 'keydown') e.preventDefault(); // Prevent scroll

        if (!started) {
            setStarted(true);
            setScore(0);
            setTimeLeft(20); // 20 seconds to prove yourself
            setCombo(0);
        }

        const now = Date.now();
        // Calculate BPM based on last 4 intervals (5 taps)
        tapsRef.current.push(now);
        if (tapsRef.current.length > 5) tapsRef.current.shift();

        if (tapsRef.current.length >= 2) {
            // Calculate average interval
            let sumIntervals = 0;
            for (let i = 1; i < tapsRef.current.length; i++) {
                sumIntervals += (tapsRef.current[i] - tapsRef.current[i - 1]);
            }
            const avgInterval = sumIntervals / (tapsRef.current.length - 1);
            const currentBpm = Math.round(60000 / avgInterval);
            setBpm(currentBpm);

            if (currentBpm >= TARGET_BPM_MIN && currentBpm <= TARGET_BPM_MAX) {
                setFeedback('¡PERFECTO! MANTÉN EL RITMO');
                setFeedbackColor('text-green-600 font-black animate-pulse');
                setScore(s => s + 100 + (combo * 10));
                setCombo(c => {
                    const newCombo = c + 1;
                    if (newCombo >= 20) finishGame(true); // Win condition: 20 good taps in a row approx
                    return newCombo;
                });
            } else if (currentBpm < TARGET_BPM_MIN) {
                setFeedback('¡MÁS RÁPIDO!');
                setFeedbackColor('text-yellow-600 font-bold');
                setCombo(0);
            } else {
                setFeedback('¡MÁS DESPACIO!');
                setFeedbackColor('text-red-600 font-bold');
                setCombo(0);
            }
        }
        lastTapRef.current = now;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleTap);
        return () => window.removeEventListener('keydown', handleTap);
    }, [started, gameWon]);

    return (
        <div className="w-full max-w-lg mx-auto bg-slate-50 rounded-3xl p-8 text-center border-4 border-slate-200 shadow-xl select-none"
            onClick={handleTap}>

            <div className="flex justify-between items-center mb-6 text-slate-400 font-bold uppercase text-xs tracking-widest">
                <span>Ritmo Vital</span>
                <span>{timeLeft}s</span>
            </div>

            {/* Heart Animation */}
            <div className="relative h-48 flex items-center justify-center mb-6">
                <Heart
                    fill="currentColor"
                    className={`text-red-500 transition-all duration-100 ${started ? 'scale-110' : 'scale-100'}`}
                    size={started ? 180 : 140}
                    style={{ transform: started ? `scale(${1 + (combo / 50)})` : 'scale(1)' }}
                />

                {!started && !gameWon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={64} className="text-white drop-shadow-lg opacity-80" />
                    </div>
                )}

                {gameWon && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in">
                        <Trophy size={80} className="text-yellow-400 drop-shadow-lg" />
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className={`text-xl ${feedbackColor} transition-colors uppercase tracking-tight`}>
                    {feedback}
                </div>
                {started && (
                    <div className="text-6xl font-black text-slate-800 my-2 font-mono">
                        {bpm} <span className="text-lg text-slate-400">BPM</span>
                    </div>
                )}
            </div>

            {/* Progress Bar for Win Condition */}
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (combo / 20) * 100)}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mb-6">Llena la barra manteniendo el ritmo verde (100-120 BPM)</p>

            {gameWon && (
                <button
                    onClick={(e) => { e.stopPropagation(); setStarted(false); setGameWon(false); setCombo(0); setScore(0); }}
                    className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-slate-700 hover:scale-105 transition-all"
                >
                    <RefreshCw size={20} /> Repetir Entrenamiento
                </button>
            )}

            <div className="text-xs text-slate-300 font-mono mt-4">
                Tap Space or Click
            </div>
        </div>
    );
};

export default CPRHero;
