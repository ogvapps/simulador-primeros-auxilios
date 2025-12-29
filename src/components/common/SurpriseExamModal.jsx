import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Send, X } from 'lucide-react';
import ExamComponent from '../dashboard/ExamComponent';

const SurpriseExamModal = ({ questions, onComplete, onClose, t, playSound, currentXp, onUsePowerup }) => {
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-submit when time expires
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAutoSubmit = () => {
        if (!submitted) {
            setSubmitted(true);
            if (playSound) playSound('error');
            // Trigger completion with current answers
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeft < 60;

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">🚨 SURPRISE EXAM!</h2>
                                <p className="text-sm opacity-90">Complete before time runs out</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isUrgent ? 'bg-red-700 animate-pulse' : 'bg-white/20'}`}>
                            <Clock size={20} />
                            <span className="font-mono font-black text-xl">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                {/* Exam Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <ExamComponent
                        questions={questions}
                        t={t}
                        onComplete={onComplete}
                        onBack={onClose}
                        playSound={playSound}
                        attempts={0}
                        currentXp={currentXp}
                        onUsePowerup={onUsePowerup}
                        forceFinish={submitted}
                    />
                </div>
            </div>
        </div>
    );
};

export default SurpriseExamModal;
