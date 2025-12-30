import React, { useState, useEffect } from 'react';
import { CheckCircle2, Gift, Sparkles, Zap, Trophy } from 'lucide-react';
import { generateDailyQuests, generateWeeklyQuests, checkQuestProgress } from '../../data/dailyQuests';

const DailyQuestsPanel = ({ progress, dailyStats, onClaimReward, t, lang = 'es' }) => {
    const [activeTab, setActiveTab] = useState('daily');
    const [dailyQuests, setDailyQuests] = useState([]);
    const [weeklyQuests, setWeeklyQuests] = useState([]);
    const [dailyCompleted, setDailyCompleted] = useState(false);
    const [weeklyCompleted, setWeeklyCompleted] = useState(false);

    // Generate and update quests
    useEffect(() => {
        // Daily
        const today = new Date().toDateString();
        const dQuests = generateDailyQuests(today);
        const dQuestsStatus = dQuests.map(q => ({
            ...q,
            completed: checkQuestProgress(q, progress, dailyStats || {})
        }));
        setDailyQuests(dQuestsStatus);
        setDailyCompleted(dQuestsStatus.length > 0 && dQuestsStatus.every(q => q.completed));

        // Weekly
        const wQuests = generateWeeklyQuests(new Date());
        const weeklyStats = progress?.weeklyStats || {};
        const wQuestsStatus = wQuests.map(q => ({
            ...q,
            completed: checkQuestProgress(q, progress, weeklyStats)
        }));
        setWeeklyQuests(wQuestsStatus);
        setWeeklyCompleted(wQuestsStatus.length > 0 && wQuestsStatus.every(q => q.completed));

    }, [progress, dailyStats]);

    const getQuestProgress = (quest, isWeekly) => {
        const stats = isWeekly ? (progress?.weeklyStats || {}) : (dailyStats || {});

        switch (quest.type) {
            case 'complete_modules': return Math.min((stats.modulesCompleted || 0) / quest.target, 1);
            case 'earn_xp': return Math.min((stats.xpEarned || 0) / quest.target, 1);
            case 'play_guardia': return Math.min((stats.guardiaPlayed || 0) / quest.target, 1);
            case 'answer_correct': return Math.min((stats.correctAnswers || 0) / quest.target, 1);
            case 'review_glossary': return Math.min((stats.glossaryViews || 0) / quest.target, 1);
            case 'maintain_streak': return (progress?.streak || 0) > 0 ? 1 : 0;
            default: return 0;
        }
    };

    const getQuestProgressText = (quest, isWeekly) => {
        const stats = isWeekly ? (progress?.weeklyStats || {}) : (dailyStats || {});
        if (quest.type === 'maintain_streak') return (progress?.streak || 0) > 0 ? '✓' : '✗';

        // Simple mapping for stats
        let current = 0;
        if (quest.type === 'complete_modules') current = stats.modulesCompleted || 0;
        if (quest.type === 'earn_xp') current = stats.xpEarned || 0;
        if (quest.type === 'play_guardia') current = stats.guardiaPlayed || 0;
        if (quest.type === 'answer_correct') current = stats.correctAnswers || 0;
        if (quest.type === 'review_glossary') current = stats.glossaryViews || 0;

        return `${current}/${quest.target}`;
    };

    const handleClaim = (type) => {
        // Calculate total for display purposes, but logic resides in App.jsx
        const quests = type === 'weekly' ? weeklyQuests : dailyQuests;
        const totalReward = quests.reduce((sum, q) => sum + q.reward, 0);
        onClaimReward(totalReward, type);
    };

    const currentQuests = activeTab === 'weekly' ? weeklyQuests : dailyQuests;
    const isCompleted = activeTab === 'weekly' ? weeklyCompleted : dailyCompleted;
    const isClaimed = activeTab === 'weekly' ? progress?.weeklyQuests?.claimed : progress?.dailyQuests?.claimed;

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">

            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md text-white">
                        {activeTab === 'weekly' ? <Trophy size={24} /> : <Sparkles size={24} />}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-purple-900">
                            {t?.quests?.title || 'Misiones'}
                        </h3>
                        <div className="flex bg-white/50 p-1 rounded-lg mt-1 gap-1">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'daily' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                            >
                                {t?.quests?.daily || 'Diarias'}
                            </button>
                            <button
                                onClick={() => setActiveTab('weekly')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'weekly' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                            >
                                {t?.quests?.weekly || 'Semanales'}
                            </button>
                        </div>
                    </div>
                </div>

                {isCompleted && !isClaimed && (
                    <button
                        onClick={() => handleClaim(activeTab)}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 animate-pulse"
                    >
                        <Gift size={20} />
                        {activeTab === 'weekly' ? (t?.quests?.claimWeekly || 'Reclamar Semanal') : (t?.quests?.claimAll || 'Reclamar Todo')}
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {currentQuests.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border-2 border-purple-100">
                        <p className="text-slate-400 italic">Cargando misiones...</p>
                    </div>
                ) : (
                    currentQuests.map((quest, idx) => {
                        const progressPct = getQuestProgress(quest, activeTab === 'weekly');
                        const progressText = getQuestProgressText(quest, activeTab === 'weekly');

                        return (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl p-4 border-2 transition-all ${quest.completed
                                    ? 'border-green-400 bg-green-50 shadow-md'
                                    : 'border-purple-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${quest.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'bg-white border-purple-300'
                                        }`}>
                                        {quest.completed && (
                                            <CheckCircle2 size={20} className="text-white" strokeWidth={3} />
                                        )}
                                    </div>

                                    <div className="text-3xl flex-shrink-0">{quest.icon}</div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className={`font-bold text-slate-800 ${quest.completed ? 'line-through text-slate-500' : ''}`}>
                                                {typeof quest.title === 'object' ? (quest.title[lang] || quest.title.es) : quest.title}
                                            </h4>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <Zap size={14} className="text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-bold text-amber-600">
                                                    +{quest.reward}
                                                </span>
                                            </div>
                                        </div>

                                        <p className={`text-xs mb-3 ${quest.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {typeof quest.description === 'object' ? (quest.description[lang] || quest.description.es) : quest.description}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${quest.completed
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                        : 'bg-gradient-to-r from-purple-400 to-blue-500'
                                                        }`}
                                                    style={{ width: `${progressPct * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold min-w-[50px] text-right ${quest.completed ? 'text-green-600' : 'text-slate-600'
                                                }`}>
                                                {progressText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {isCompleted && (
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 text-center animate-in zoom-in">
                    <p className="text-lg font-black text-yellow-900 mb-1">
                        🎉 {t?.quests?.allComplete || '¡Todas las misiones completadas!'}
                    </p>
                    <p className="text-sm text-yellow-700">
                        {activeTab === 'weekly'
                            ? (t?.quests?.bonusWeekly || 'Bonus Semanal: +100 XP')
                            : (t?.quests?.bonusReward || 'Bonus Diario: +50 XP')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DailyQuestsPanel;
