import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const DailyChallenge = ({ scenarios, t, onComplete, onClose, playSound }) => {
    const [scenario, setScenario] = useState(null);
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState(null); // 'correct' | 'wrong'

    useEffect(() => {
        if (scenarios && scenarios.length > 0) {
            // Pick a random scenario based on the day of the year (Deterministic for all users on the same day)
            const today = new Date();
            // Create a unique integer for the day: YYYYMMDD
            const dateHash = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

            // USE LARGE PRIME HASH TO ENSURE GOOD DISTRIBUTION EVEN FOR CLOSE DATES
            // 2654435761 is Knuth's multiplicative hash constant (2^32 / phi)
            const index = Math.abs((dateHash * 2654435761) % scenarios.length);

            console.log("Pool:", scenarios.length, "Index:", index); // DEBUG

            setScenario(scenarios[index]);
        }
    }, [scenarios]);

    const handleAnswer = (index) => {
        if (selected !== null) return;
        setSelected(index);

        const isCorrect = index === scenario.correct;
        setResult(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            if (playSound) playSound('success');
            // Wait a bit then callback
            setTimeout(() => onComplete(true), 2500);
        } else {
            if (playSound) playSound('error');
            setTimeout(() => onComplete(false), 3000);
        }
    };

    if (!scenario) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
                <button onClick={() => onClose()} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XCircle size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6 text-brand-600 font-black uppercase tracking-widest text-sm">
                    <AlertTriangle size={20} /> {t?.daily?.title || "Desafío Diario"}
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-6 leading-tight">
                    {scenario.q}
                </h3>

                <div className="space-y-3 mb-6">
                    {scenario.options.map((opt, idx) => {
                        let statusClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (selected !== null) {
                            if (idx === scenario.correct) statusClass = 'bg-green-100 border-green-500 text-green-800 font-bold';
                            else if (idx === selected) statusClass = 'bg-red-100 border-red-500 text-red-800 opacity-60';
                            else statusClass = 'opacity-50';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={selected !== null}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center justify-between group ${statusClass}`}
                            >
                                <span>{opt}</span>
                                {selected !== null && idx === scenario.correct && <CheckCircle2 size={20} className="text-green-600" />}
                                {selected === idx && idx !== scenario.correct && <XCircle size={20} className="text-red-600" />}
                            </button>
                        );
                    })}
                </div>

                {result && (
                    <div className={`p-4 rounded-xl text-sm font-medium animate-in slide-in-from-bottom-2 ${result === 'correct' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <div className="font-bold flex items-center gap-2 mb-1">
                            {result === 'correct' ? (t?.daily?.correct || '¡CORRECTO! +50 XP') : (t?.daily?.wrong || 'FALLO - Vuelve mañana')}
                        </div>
                        <p>{scenario.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyChallenge;
