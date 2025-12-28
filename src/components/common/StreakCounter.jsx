import React from 'react';
import { Flame, Target } from 'lucide-react';
import { getNextMilestone, getStreakProgress } from '../../utils/streakSystem';

const StreakCounter = ({ currentStreak, bestStreak, compact = false }) => {
    const nextMilestone = getNextMilestone(currentStreak);
    const progress = getStreakProgress(currentStreak);

    if (compact) {
        // Compact version for floating display during gameplay
        return (
            <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-right-4">
                <Flame size={20} className={currentStreak > 0 ? 'animate-pulse' : ''} />
                <span className="font-black text-lg">{currentStreak}</span>
                {nextMilestone && (
                    <span className="text-xs opacity-80">/ {nextMilestone.count}</span>
                )}
            </div>
        );
    }

    // Full version for dashboard
    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Flame size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-orange-900">Perfect Streak</h3>
                        <p className="text-xs text-orange-600">Consecutive correct answers</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-orange-600">{currentStreak}</p>
                    <p className="text-xs text-orange-500 font-bold">Best: {bestStreak || 0}</p>
                </div>
            </div>

            {nextMilestone && (
                <div>
                    <div className="flex justify-between text-xs font-bold text-orange-700 mb-2">
                        <span>Next: {nextMilestone.name}</span>
                        <span>{nextMilestone.count} answers</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-orange-600 mt-2 text-center">
                        {nextMilestone.count - currentStreak} more to unlock +{nextMilestone.xp} XP!
                    </p>
                </div>
            )}

            {!nextMilestone && currentStreak >= 100 && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-center">
                    <Target size={32} className="mx-auto text-yellow-600 mb-2" />
                    <p className="font-black text-yellow-900">LEGENDARY STATUS!</p>
                    <p className="text-xs text-yellow-700">You've reached the maximum streak!</p>
                </div>
            )}
        </div>
    );
};

export default StreakCounter;
