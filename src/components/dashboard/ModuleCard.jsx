import React, { memo } from 'react';
import { CheckCircle2, Lock, BookOpen } from 'lucide-react';
import { ICON_MAP } from './InsigniasPanel';

const ModuleCard = memo(({ module, progress, onClick, isLocked, t, isRecommended }) => {
    const isCompleted = (module.type === 'module' || module.type === 'roleplay' || module.type === 'timeTrial' || module.type === 'glossary') && progress[`${module.id}Completed`];

    // Dynamic Styles
    let statusColor = "bg-brand-50 text-brand-700";
    let borderColor = "border-brand-500";
    let statusLabel = t?.card?.available || "Disponible";

    if (module.type === 'exam') {
        statusLabel = isLocked ? (t?.card?.locked || "Bloqueado") : (t?.card?.finalExam || "Examen Final");
        statusColor = isLocked ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
        borderColor = "border-indigo-600";
    } else if (module.type === 'certificate' || module.type === 'desa') {
        statusLabel = isLocked ? (t?.card?.locked || "Bloqueado") : (t?.card?.unlocked || "Desbloqueado");
        statusColor = isLocked ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
        borderColor = "border-yellow-500";
    } else if (module.type === 'roleplay') {
        statusLabel = t?.card?.simulation || "Simulación";
        statusColor = "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300";
        borderColor = "border-violet-500";
    } else if (module.type === 'timeTrial') {
        statusLabel = t?.card?.timeTrial || "Contrarreloj";
        statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        borderColor = "border-yellow-400";
    }

    if (isCompleted) {
        statusLabel = t?.card?.completed || "Completado";
        statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
        borderColor = "border-emerald-500";
    }

    const containerClasses = isLocked
        ? "opacity-60 grayscale bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed border-slate-200 dark:border-slate-700"
        : isRecommended
            ? "bg-white dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-lg scale-[1.02]"
            : "bg-white dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-slate-100 dark:border-slate-700 hover:border-brand-300";

    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={`group relative flex flex-col h-full w-full rounded-2xl shadow-sm overflow-hidden border text-left transition-all duration-300 ${containerClasses}`}
        >
            {isRecommended && !isCompleted && !isLocked && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1 animate-pulse">
                    ⭐ Tarea
                </div>
            )}

            {/* Decorative Top Line */}
            <div className={`h-1.5 w-full ${isLocked ? 'bg-slate-300' : borderColor.replace('border-', 'bg-')}`} />

            <div className="p-6 flex flex-col flex-grow w-full">
                <div className="flex justify-between items-start mb-4">
                    {/* Icon Box */}
                    <div className={`
            p-3.5 rounded-2xl transition-all duration-300
            ${isLocked
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-600 dark:group-hover:text-brand-400 shadow-sm'}
          `}>
                        {React.cloneElement(ICON_MAP[module.icon] || <BookOpen />, { size: 32 })}
                    </div>

                    {/* Completion/Lock Badge */}
                    {isCompleted ? (
                        <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shadow-sm animate-in zoom-in">
                            <CheckCircle2 size={18} />
                        </div>
                    ) : isLocked && (
                        <div className="bg-slate-100 p-1.5 rounded-full text-slate-400">
                            <Lock size={18} />
                        </div>
                    )}
                </div>

                <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${isLocked ? 'text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                    {module.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {module.description}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50 w-full flex justify-between items-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                        {statusLabel}
                    </span>
                    {!isCompleted && !isLocked && (
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-800/30">
                            +50 XP
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
});

export default ModuleCard;
