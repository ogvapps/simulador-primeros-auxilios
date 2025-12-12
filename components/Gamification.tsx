import React, { useEffect, useState } from 'react';
import { Trophy, X, Flame, Download, Share2, Star, PlusSquare } from 'lucide-react';
import { Badge } from '../types';
import { Button, Card } from './DesignSystem';
import { playSound } from '../utils';

/**
 * ACHIEVEMENT MODAL
 * Shows when a user unlocks a specific badge/module.
 */
export const AchievementModal = ({ badge, onClose }: { badge: Badge | null, onClose: () => void }) => {
  if (!badge) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `¡He desbloqueado la insignia ${badge.title}!`,
          text: `Estoy aprendiendo primeros auxilios y he conseguido la insignia de ${badge.title}. ¡Únete y aprende a salvar vidas!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`¡He conseguido la insignia ${badge.title} en el Simulador de Primeros Auxilios!`);
      alert("Texto copiado al portapapeles");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-in zoom-in-95 duration-300 border-4 border-yellow-400" onClick={e => e.stopPropagation()}>
        
        {/* Background Rays Effect */}
        <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-yellow-200 to-yellow-50 opacity-50 rounded-full animate-spin-slow" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
        </div>

        <div className="relative z-10">
            <div className="mx-auto bg-white p-4 rounded-full w-24 h-24 flex items-center justify-center shadow-lg mb-6 ring-4 ring-yellow-100">
                {React.cloneElement(badge.icon as React.ReactElement, { size: 48, className: badge.color })}
            </div>
            
            <h3 className="text-gray-500 dark:text-gray-300 font-bold uppercase tracking-widest text-sm mb-1">¡Insignia Desbloqueada!</h3>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">{badge.title}</h2>
            
            <div className="flex gap-2 justify-center mb-6">
                <Star className="text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
                <Star className="text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <Star className="text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>

            <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleShare} leftIcon={<Share2 size={16}/>}>
                    Compartir
                </Button>
                <Button variant="primary" className="flex-[2] shadow-yellow-200 hover:shadow-yellow-300" onClick={onClose}>
                    ¡Genial!
                </Button>
            </div>
        </div>

        {/* Confetti CSS */}
        <style>{`
          .confetti-piece { position: absolute; width: 10px; height: 10px; background: #f00; top: -10px; opacity: 0; }
          .confetti-piece:nth-child(odd) { background: #17bb61; }
          .confetti-piece:nth-child(even) { background: #3b82f6; }
          .confetti-piece:nth-child(3n) { background: #eab308; }
          .confetti-piece:nth-child(4n) { background: #ef4444; }
          .confetti-piece:nth-child(1) { left: 10%; animation: fall 2.5s ease-out infinite; }
          .confetti-piece:nth-child(2) { left: 30%; animation: fall 2.3s ease-out infinite 0.2s; }
          .confetti-piece:nth-child(3) { left: 50%; animation: fall 2.6s ease-out infinite 0.4s; }
          .confetti-piece:nth-child(4) { left: 70%; animation: fall 2.4s ease-out infinite 0.1s; }
          .confetti-piece:nth-child(5) { left: 90%; animation: fall 2.7s ease-out infinite 0.3s; }
          @keyframes fall {
            0% { top: -10px; transform: rotate(0deg) translateX(0); opacity: 1; }
            100% { top: 100%; transform: rotate(360deg) translateX(20px); opacity: 0; }
          }
        `}</style>
        <div className="confetti-piece"></div><div className="confetti-piece"></div><div className="confetti-piece"></div><div className="confetti-piece"></div><div className="confetti-piece"></div>
      </div>
    </div>
  );
};

/**
 * STREAK WIDGET
 * Visualizes the daily streak in the profile.
 */
export const StreakWidget = ({ streak }: { streak: number }) => {
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const today = new Date().getDay(); // 0 is Sunday
    // Adjust to 0=Monday, 6=Sunday for UI
    const adjustedToday = today === 0 ? 6 : today - 1;

    return (
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-none shadow-orange-200" padding="md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg flex items-center"><Flame className="mr-2 fill-yellow-300 text-yellow-300 animate-pulse" /> Racha de Fuego</h3>
                    <p className="text-orange-100 text-xs">Entrena a diario para mantener la llama.</p>
                </div>
                <div className="text-4xl font-black">{streak}</div>
            </div>
            
            <div className="flex justify-between gap-1">
                {days.map((day, i) => {
                    const isPast = i < adjustedToday;
                    const isToday = i === adjustedToday;
                    // Logic: Assuming if streak > 0, today is active. Past days are active based on streak count roughly.
                    const isActive = isToday || (isPast && (adjustedToday - i) < streak);
                    
                    return (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-orange-200 mb-1">{day}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? 'bg-white text-orange-600 shadow-md scale-110' : 'bg-white/20 text-orange-100'}`}>
                                {isActive ? '✓' : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

/**
 * PWA INSTALL PROMPT
 */
export const PwaInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Check if standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        
        if (isIosDevice && !isStandalone) {
            // Show prompt for iOS if not already installed
            // We use a small delay to not annoy immediately
            const hasSeenPrompt = localStorage.getItem('pas_ios_prompt_seen');
            if (!hasSeenPrompt) {
                setTimeout(() => setIsVisible(true), 3000);
            }
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    const closePrompt = () => {
        setIsVisible(false);
        if (isIOS) localStorage.setItem('pas_ios_prompt_seen', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-50 p-4 animate-in slide-in-from-top-full duration-500">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex flex-col max-w-md mx-auto border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <div className="bg-slate-800 p-2 rounded-xl mr-3">
                            <Download size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Instalar App</h4>
                            <p className="text-xs text-slate-400">Funciona sin internet</p>
                        </div>
                    </div>
                    <button onClick={closePrompt} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                
                {isIOS ? (
                    <div className="text-xs text-slate-300 mt-2 p-3 bg-slate-800 rounded-lg">
                        <p className="mb-2">Para instalar en iPhone/iPad:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Pulsa el botón <strong>Compartir</strong> <Share2 size={12} className="inline"/></li>
                            <li>Selecciona <strong>Añadir a Inicio</strong> <PlusSquare size={12} className="inline"/></li>
                        </ol>
                    </div>
                ) : (
                    <button onClick={handleInstall} className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/50">
                        Instalar Ahora
                    </button>
                )}
            </div>
        </div>
    );
};