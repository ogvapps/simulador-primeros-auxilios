import React, { memo } from 'react';
import { Trophy, ShieldCheck, UserCheck, HeartPulse, Flame, Wind, Frown, HardHat, Smile, Brain, Syringe, AirVent, Activity, Gauge, Waves, BriefcaseMedical, Siren, MessageSquare, GraduationCap, Zap, BookOpen, Award } from 'lucide-react';

const DropletsIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>
);

export const ICON_MAP = {
    pas: <ShieldCheck size={48} className="text-blue-500" />,
    pls: <UserCheck size={48} className="text-green-500" />,
    rcp: <HeartPulse size={48} className="text-red-500" />,
    hemorragia: <DropletsIcon className="text-red-600" />,
    quemaduras: <Flame size={48} className="text-orange-500" />,
    atragantamiento: <Wind size={48} className="text-cyan-500" />,
    sincope: <Frown size={48} className="text-teal-500" />,
    golpes: <HardHat size={48} className="text-slate-600" />,
    bucodental: <Smile size={48} className="text-pink-500" />,
    craneo: <Brain size={48} className="text-purple-600" />,
    anafilaxia: <Syringe size={48} className="text-red-700" />,
    asma: <AirVent size={48} className="text-blue-600" />,
    epilepsia: <Activity size={48} className="text-indigo-500" />,
    diabetes: <Gauge size={48} className="text-blue-700" />,
    ansiedad: <Waves size={48} className="text-green-400" />,
    botiquin: <BriefcaseMedical size={48} className="text-red-400" />,
    examen: <GraduationCap size={48} className="text-indigo-700" />,
    glosario: <BookOpen size={48} className="text-slate-600" />,
    certificado: <Award size={48} className="text-yellow-500" />,
    desa: <Zap size={48} className="text-yellow-600" />,
    roleplay: <MessageSquare size={48} className="text-violet-600" />,
    triaje: <Siren size={48} className="text-rose-600" />,
    zap: <Zap size={48} className="text-yellow-500 animate-pulse" />,
};

// We will use modules prop to get titles dynamically.
// Colors are hardcoded here for visual consistency.
const BADGE_COLORS = {
    pas: 'text-blue-500',
    pls: 'text-green-500',
    rcp: 'text-red-500',
    hemorragia: 'text-red-600',
    quemaduras: 'text-orange-500',
    atragantamiento: 'text-cyan-500',
    sincope: 'text-teal-500',
    golpes: 'text-slate-600',
    bucodental: 'text-pink-500',
    craneo: 'text-purple-600',
    anafilaxia: 'text-red-700',
    asma: 'text-blue-600',
    epilepsia: 'text-indigo-500',
    diabetes: 'text-blue-700',
    ansiedad: 'text-green-400',
    botiquin: 'text-red-400',
    triaje: 'text-rose-600',
    sim_patio: 'text-violet-500',
    sim_comedor: 'text-violet-500',
};

// IDs that we want to show badges for (must match modules)
const DISPLAY_BADGES = [
    'pas', 'pls', 'rcp', 'hemorragia', 'quemaduras', 'atragantamiento',
    'sincope', 'golpes', 'bucodental', 'craneo', 'anafilaxia', 'asma',
    'epilepsia', 'diabetes', 'ansiedad', 'botiquin', 'triaje',
    'sim_patio', 'sim_comedor'
];

export const LEARNING_MODULE_IDS = DISPLAY_BADGES;

const InsigniasPanel = memo(({ progress, currentLevel, currentXp, t, modules, hiddenBadges }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-sm print:hidden py-4 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        <Trophy className="text-yellow-500 mr-2" size={20} />
                        {t?.badges?.title || "Tu Colección de Insignias"}
                    </h2>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full font-bold text-xs ring-1 ring-yellow-200 dark:ring-yellow-700/50">
                        Total XP: {currentXp}
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-4">
                    {DISPLAY_BADGES.map((id) => {
                        const isUnlocked = progress[`${id}Completed`];
                        const module = modules?.find(m => m.id === id);
                        const title = module?.title || id;
                        const icon = module?.icon ? (ICON_MAP[module.icon] || ICON_MAP.pas) : ICON_MAP.pas;
                        const color = BADGE_COLORS[id] || 'text-slate-500';

                        return (
                            <div key={id} className="flex flex-col items-center group w-full" title={title}>
                                <div
                                    className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500
                    ${isUnlocked
                                            ? 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md scale-100 border-2 border-white dark:border-slate-700 ring-2 ring-brand-100 dark:ring-brand-900/50 group-hover:-translate-y-1'
                                            : 'bg-slate-100 dark:bg-slate-800 grayscale opacity-40 inset-shadow-sm'}
                  `}
                                >
                                    {React.cloneElement(icon, {
                                        size: 24,
                                        className: isUnlocked ? color : 'text-slate-400 dark:text-slate-600'
                                    })}
                                </div>
                                <span className={`text-[10px] font-bold text-center leading-tight max-w-[80px] ${isUnlocked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                    {title}
                                </span>
                            </div>
                        );
                    })}

                    {/* HIDDEN BADGES */}
                    {hiddenBadges && hiddenBadges.map((badge) => {
                        const isUnlocked = progress.badges?.includes(badge.id);
                        return (
                            <div key={badge.id} className="flex flex-col items-center group w-full" title={badge.desc}>
                                <div
                                    className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500 border-2
                                        ${isUnlocked
                                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 shadow-md scale-100 ring-2 ring-yellow-100 dark:ring-yellow-900/40 group-hover:-translate-y-1'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 grayscale'}
                                    `}
                                >
                                    <span className="text-2xl filter drop-shadow-sm">
                                        {badge.icon}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-bold text-center leading-tight max-w-[80px] ${isUnlocked ? 'text-yellow-700 dark:text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}>
                                    {badge.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default InsigniasPanel;
