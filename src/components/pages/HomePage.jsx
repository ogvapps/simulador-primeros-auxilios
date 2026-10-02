import React from 'react';
import { FileText, Download, ShoppingBag, User, Trophy, Sparkles, Play, CheckCircle2, AlertTriangle, Zap, UserCheck } from 'lucide-react';
import DailyQuestsPanel from '../dashboard/DailyQuestsPanel';
import DailyChallenge from '../dashboard/DailyChallenge';
import ModuleCard from '../dashboard/ModuleCard';

const HomePage = ({
  profile, currentLevel, currentXp, progress, activeAvatarIcon, showDailyChallenge, dailyPool,
  classAssignments, lang, t, allModulesDone, examPassed, MODULES, LEVELS,
  setView, handleModuleClick, updateProgress, playSound, generateCheatSheet,
  addToast, setShowDailyChallenge, handleClaimQuestReward
}) => {
  const today = new Date().toDateString();
  const lastPlayed = progress.lastDailyChallenge ? new Date(progress.lastDailyChallenge).toDateString() : null;
  const canPlay = today !== lastPlayed;

  return (
    <div className="space-y-8 pb-20">
      <div className="md:hidden w-full bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex items-center justify-between animate-in slide-in-from-top-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-2xl border-2 border-white dark:border-slate-600 shadow-sm">
            {profile?.activeAvatarIcon || activeAvatarIcon}
          </div>
          <div>
            <h2 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{profile?.name || 'Agente'}</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">Lvl {currentLevel}</span>
              <span className="text-brand-600 dark:text-brand-400">{currentXp} XP</span>
            </div>
          </div>
        </div>
        <div className="bg-brand-50 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400" onClick={() => setView('profile')}>
          <UserCheck size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6 animate-in slide-in-from-top-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
            {t?.home?.welcome || "Tu Entrenamiento"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            {t?.home?.subtitle || "Completa todos los módulos teóricos para desbloquear el examen final y obtener tu certificado."}
          </p>
        </div>

        <button onClick={() => { generateCheatSheet(); playSound('success'); }}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-all text-sm mb-2 md:mb-0">
          <FileText size={18} />
          <span className="hidden md:inline">{t?.home?.cheatSheet || "Ficha Resumen"}</span>
          <span className="md:hidden">PDF</span>
          <Download size={14} className="opacity-50" />
        </button>

        <div className="flex gap-2">
          <button onClick={() => setView('shop')}
            className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-yellow-400 hover:scale-105 transition-all group"
            title={t?.home?.shop}>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-2 rounded-lg mb-1 group-hover:bg-yellow-400 group-hover:text-yellow-900 transition-colors">
              <ShoppingBag size={20} className="stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t?.home?.shop}</span>
          </button>
          <button onClick={() => setView('profile')}
            className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-orange-400 hover:scale-105 transition-all group"
            title={t?.profile?.backpack_btn || "Mochila"}>
            <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg mb-1 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <User size={20} className="stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">P.A.S.</span>
          </button>
          <button onClick={() => setView('leaderboard')}
            className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-brand-400 hover:scale-105 transition-all group"
            title={t?.home?.rank}>
            <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 p-2 rounded-lg mb-1 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Trophy size={20} className="stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Rank</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-1 shadow-lg shadow-indigo-200 mt-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-wider text-xs mb-2">
              <Sparkles size={16} className="text-yellow-300" /> {t?.home?.dailyChallenge?.new}
            </div>
            <h2 className="text-3xl font-black mb-2">{t?.home?.dailyChallenge?.title}</h2>
            <p className="text-indigo-100 font-medium">{t?.home?.dailyChallenge?.desc}</p>
          </div>
          {canPlay ? (
            <button onClick={() => setShowDailyChallenge(true)}
              className="bg-white text-indigo-600 font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Play fill="currentColor" size={20} /> {t?.home?.dailyChallenge?.play}
            </button>
          ) : (
            <button disabled className="bg-indigo-800/50 text-indigo-300 font-bold py-3 px-8 rounded-xl cursor-not-allowed flex items-center gap-2">
              <CheckCircle2 size={20} /> {t?.home?.dailyChallenge?.completed}
            </button>
          )}
        </div>
      </div>

      <DailyQuestsPanel
        progress={progress}
        dailyStats={progress.dailyStats}
        onClaimReward={handleClaimQuestReward}
        t={t}
        lang={lang}
      />

      <div onClick={() => setView('practice')}
        className="group relative bg-white dark:bg-slate-800 border-2 border-brand-100 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl hover:border-brand-500 transition-all cursor-pointer overflow-hidden mt-6 mb-8">
        <div className="absolute top-0 right-0 p-12 bg-brand-50 rounded-full -mr-6 -mt-6 group-hover:bg-brand-100 transition-colors"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <Zap size={14} /> Entrena tu mente
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Modo Práctica</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-lg">
              Practica con cientos de preguntas reales de primeros auxilios. Gana XP por cada respuesta correcta y completa tus misiones diarias.
            </p>
          </div>
          <div className="bg-brand-600 text-white p-6 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
            <FileText size={40} />
          </div>
        </div>
      </div>

      {showDailyChallenge && (
        <DailyChallenge
          scenarios={dailyPool}
          t={t}
          onComplete={(success) => {
            setShowDailyChallenge(false);
            const updates = { lastDailyChallenge: new Date().toISOString() };
            if (success) {
              updates.xpGain = 50;
              addToast(t?.toasts?.dailySuccess || "¡Desafío completado! +50 XP", 'success');
            }
            updateProgress(updates);
          }}
          onClose={() => setShowDailyChallenge(false)}
          playSound={playSound}
        />
      )}

      {currentLevel >= 3 ? (
        <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden relative group cursor-pointer border-2 border-slate-700 hover:border-red-500 transition-colors" onClick={() => setView('guardia')}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          <div className="absolute top-0 right-0 p-32 bg-red-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Acceso Restringido
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-2 italic tracking-tighter">MODO GUARDIA</h2>
              <p className="text-slate-400 text-lg font-medium max-w-lg">Pon a prueba tus reflejos en situaciones de emergencia real. Contrarreloj.</p>
            </div>
            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-red-900/50 transform group-hover:scale-105 transition-all flex items-center gap-3 text-lg">
              <Play fill="currentColor" /> INICIAR TURNO
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Modo Guardia Bloqueado</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Alcanza el <span className="font-bold text-brand-600 dark:text-brand-400">Nivel 3 ({LEVELS[2].name})</span> para desbloquear el simulador de guardia.</p>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-slate-300 dark:bg-slate-600" style={{ width: `${(currentXp / 400) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map(m => {
          let isLocked = false;
          if (m.type === 'exam') isLocked = !allModulesDone;
          else if (m.type === 'certificate' || m.type === 'desa') isLocked = !examPassed;
          return (
            <ModuleCard
              key={m.id}
              module={m}
              progress={progress}
              onClick={() => handleModuleClick(m)}
              isLocked={isLocked}
              t={t}
              isRecommended={classAssignments?.moduleId === m.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
