import React, { memo, useCallback, useMemo, useEffect, useState } from 'react';
import { Medal, Volume2, Play, Map, Dumbbell, User, Settings, ArrowRight, Star, Trophy, Flame, X, CheckCircle, AlertCircle, Info, WifiOff, Loader2, RotateCw } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { LEVELS, LEARNING_MODULE_IDS, MODULES } from '../constants';
import { Module } from '../types';

export const PageTransition = ({ children, viewKey }: { children?: React.ReactNode, viewKey: string }) => 
  <div key={viewKey} className="animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 ease-out w-full pb-6 will-change-transform">{children}</div>;

export const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full text-red-600 animate-in fade-in duration-300">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando recursos...</p>
    </div>
);

export const Footer = memo(() => (
    <div className="w-full py-4 text-center text-gray-400 dark:text-gray-500 text-xs mt-auto border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 px-4">
      <span className="font-semibold text-gray-600 dark:text-gray-400">Creado por ogvapps</span>
      <a href="mailto:ogonzalezv01@educarex.es" className="text-blue-500 hover:text-blue-700 transition-colors font-medium">
        ogonzalezv01@educarex.es
      </a>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" className="hover:opacity-100 transition-opacity hover:scale-105 transform duration-200 flex items-center gap-2">
        <img alt="Licencia Creative Commons" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" className="h-5" />
        <span className="text-[10px] text-gray-500 dark:text-gray-500 hidden md:inline">Licencia CC BY-NC-SA 4.0</span>
      </a>
    </div>
        </div>
));

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-slate-800 text-white text-xs font-bold py-2 px-4 text-center animate-in slide-in-from-bottom-full fixed bottom-[70px] left-4 right-4 rounded-lg shadow-lg z-50 flex items-center justify-between opacity-95">
      <div className="flex items-center gap-2">
          <WifiOff size={14} />
          <span>Sin conexión. Modo Offline activo.</span>
      </div>
      <button onClick={() => window.location.reload()} className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center ml-2">
          <RotateCw size={12} className="mr-1" /> Reintentar
      </button>
    </div>
  );
};

export const ToastNotification = memo(({ 
  toasts, 
  removeToast 
}: { 
  toasts: { id: string, type: 'success' | 'error' | 'info', message: string }[], 
  removeToast: (id: string) => void 
}) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`
            pointer-events-auto flex items-center p-4 rounded-xl shadow-lg min-w-[300px] max-w-[90vw] animate-in slide-in-from-right-full fade-in duration-300
            ${toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-800' : ''}
            ${toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-800' : ''}
          `}
        >
          <div className="mr-3">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <p className="flex-1 font-medium text-sm">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
});

export const GlobalProgressBar = memo(() => {
  const { progress, currentLevel, currentXp, nextLevelXp } = useGame();
  
  const streak = progress.streak || 0;
  const prevLevelXp = LEVELS.find(l => l.level === currentLevel - 1)?.minXp || 0;
  const levelRange = nextLevelXp - prevLevelXp;
  const currentLevelProgress = currentXp - prevLevelXp;
  const xpPercentage = Math.min(100, Math.max(0, (currentLevelProgress / levelRange) * 100));

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm print:hidden transition-all duration-300">
       <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
             <div className="flex gap-3">
                 <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center animate-in fade-in"><Medal size={14} className="mr-1 text-yellow-500"/> Nivel {currentLevel}: {LEVELS[currentLevel-1].name}</span>
                 {streak > 0 && (
                     <span className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center animate-in fade-in animate-pulse">
                         <Flame size={14} className="mr-1 fill-orange-500"/> {streak} días
                     </span>
                 )}
             </div>
             <span className="text-xs font-bold text-gray-400">{currentXp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative group cursor-help" title={`XP: ${currentXp}`}>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${xpPercentage}%` }} />
          </div>
       </div>
    </div>
  );
});

export const SpeakButton = memo(({ text }: { text: string }) => {
  const { playSound } = useGame();
  
  const speak = useCallback((e: React.MouseEvent) => { 
    e.stopPropagation(); 
    playSound('click'); 
    if (!text || !window.speechSynthesis) return; 
    window.speechSynthesis.cancel(); 
    const u = new SpeechSynthesisUtterance(text); 
    u.lang = 'es-ES'; 
    window.speechSynthesis.speak(u); 
  }, [text, playSound]);
  
  return <button onClick={speak} className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 ml-2 transition-transform active:scale-90"><Volume2 size={20} /></button>;
});

export const HeroSection = memo(({ onStartModule }: { onStartModule: (m: Module) => void }) => {
    const { progress, profile, playSound } = useGame();
    
    const nextModule = useMemo(() => {
        return MODULES.find(m => {
            if (m.type === 'module' || m.type === 'roleplay' || m.type === 'flashcards') {
                return !progress[`${m.id}Completed`];
            }
            if (m.type === 'exam') return !progress.examenPassed;
            return false;
        });
    }, [progress]);

    const isAllComplete = !nextModule;
    const userName = profile?.name || 'Héroe';

    return (
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl mb-8 group cursor-pointer transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]" onClick={() => { if(nextModule) playSound('click'); nextModule && onStartModule(nextModule); }}>
             <div className={`absolute inset-0 bg-gradient-to-r ${isAllComplete ? 'from-yellow-400 to-orange-500' : 'from-blue-600 to-indigo-700'}`}></div>
            
            {/* Decorators */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-32 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                        {isAllComplete ? <Trophy size={18} className="text-yellow-100" /> : <Flame size={18} className="text-orange-200" />}
                        <span className="text-sm font-bold uppercase tracking-wider">{isAllComplete ? '¡Entrenamiento Completado!' : 'Continuar Misión'}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
                        {isAllComplete ? `¡Enhorabuena, ${userName}!` : `¡Vamos, ${userName}!`}
                    </h2>
                    
                    <p className="text-blue-100 text-sm md:text-base font-medium max-w-md">
                        {isAllComplete 
                            ? "Has dominado todas las técnicas. ¡Eres un experto en salvar vidas! Revisa tu certificado." 
                            : `Tu próximo objetivo es: ${nextModule?.title}. ¡Cada segundo cuenta!`}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <button className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center transition-transform active:scale-95 ${isAllComplete ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-white text-blue-600 hover:bg-blue-50'}`}>
                            {isAllComplete ? <><Star size={18} className="mr-2"/> Ver Certificado</> : <><Play size={18} className="mr-2 fill-current"/> Continuar</>}
                        </button>
                    </div>
                </div>

                {/* Right Side Icon/Visual */}
                <div className="hidden md:flex items-center justify-center bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30 shadow-inner">
                    {isAllComplete ? <Medal size={64} className="text-yellow-200" /> : (
                         <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                            <Play size={48} className="relative z-10 fill-white" />
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export const BottomNavigation = memo(({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const { playSound } = useGame();
  
  const tabs = [
    { id: 'map', label: 'Misiones', icon: <Map size={24} /> },
    { id: 'training', label: 'Entreno', icon: <Dumbbell size={24} /> },
    { id: 'ranking', label: 'Ranking', icon: <Trophy size={24} /> },
    { id: 'profile', label: 'Perfil', icon: <User size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pt-2 px-6 shadow-2xl z-40 flex justify-center pb-4 print:hidden transition-colors duration-300">
      <div className="flex justify-between items-center w-full max-w-lg">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id} 
            onClick={() => { playSound('click'); onTabChange(tab.id); }}
            className={`flex flex-col items-center justify-center w-full p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-red-600 dark:text-red-500 scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <div className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {tab.label}
            </span>
            {isActive && <div className="w-1 h-1 bg-red-600 rounded-full mt-1" />}
          </button>
        );
      })}
      </div>
    </div>
  );
});
