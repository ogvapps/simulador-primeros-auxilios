import React, { useEffect } from 'react';
import { Flame, Trophy, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const StreakMilestoneCelebration = ({ milestone, onClose }) => {
    useEffect(() => {
        // Confetti explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#f97316', '#ef4444', '#fbbf24'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Auto-close after 4 seconds
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-1 rounded-3xl animate-in zoom-in-50 duration-500">
                <div className="bg-white rounded-3xl p-8 max-w-md text-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                            <Flame size={48} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 animate-spin-slow">
                            <Star size={32} className="text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
                        {milestone.name}!
                    </h2>

                    <p className="text-6xl font-black text-orange-600 mb-4">
                        {milestone.count}
                    </p>

                    <p className="text-slate-600 font-bold mb-6">
                        Consecutive correct answers!
                    </p>

                    <div className="flex items-center justify-center gap-4 bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-yellow-600" size={24} />
                            <span className="font-black text-orange-900">Badge Unlocked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-600" size={24} />
                            <span className="font-black text-blue-900">+{milestone.xp} XP</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:shadow-lg transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StreakMilestoneCelebration;
