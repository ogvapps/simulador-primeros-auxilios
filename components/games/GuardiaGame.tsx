import React, { memo, useState, useEffect } from 'react';
import { Siren, HeartPulse, Droplets, Wind, Frown, Zap, FileSpreadsheet, User, ArrowRight, XCircle, Volume2 } from 'lucide-react';
import { playSound } from '../../utils';
import { XP_REWARDS } from '../../constants';

export const GuardiaGame = memo(({ onComplete, onExit }: { onComplete: (xp: number) => void, onExit: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [patientHealth, setPatientHealth] = useState(100);
  const [activeScenario, setActiveScenario] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<{type: 'hit' | 'miss', text: string} | null>(null);

  const scenarios = [
    { text: "¡Varón inconsciente, no respira!", tool: "rcp", icon: <HeartPulse size={40} className="text-red-500"/> },
    { text: "¡Corte profundo en brazo, mucha sangre!", tool: "venda", icon: <Droplets size={40} className="text-red-700"/> },
    { text: "¡Atragantamiento, se lleva manos al cuello!", tool: "heimlich", icon: <Wind size={40} className="text-blue-500"/> },
    { text: "¡Persona mareada, pálida, suda frío!", tool: "piernas", icon: <Frown size={40} className="text-yellow-500"/> },
    { text: "¡Parada cardiaca confirmada, traedlo!", tool: "desa", icon: <Zap size={40} className="text-yellow-600"/> },
  ];

  const tools = [
    { id: "rcp", label: "RCP", icon: <HeartPulse />, key: '1' },
    { id: "venda", label: "Compresión", icon: <FileSpreadsheet />, key: '2' },
    { id: "heimlich", label: "Heimlich", icon: <User />, key: '3' },
    { id: "piernas", label: "Elevar Piernas", icon: <ArrowRight className="-rotate-45" />, key: '4' },
    { id: "desa", label: "DESA", icon: <Zap />, key: '5' },
    { id: "telefono", label: "Llamar 112", icon: <Volume2 />, key: '6' },
  ];

  useEffect(() => {
    if (gameOver) return;
    if (!activeScenario) {
      const random = scenarios[Math.floor(Math.random() * scenarios.length)];
      setActiveScenario(random);
      setTimeLeft(10 - Math.min(5, score * 0.5));
      setPatientHealth(100);
      playSound('alarm');
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameOver(true);
          playSound('error');
          return 0;
        }
        return prev - 0.1;
      });
      setPatientHealth(prev => Math.max(0, prev - 0.8));
    }, 100);

    return () => clearInterval(timer);
  }, [activeScenario, gameOver, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        const tool = tools.find(t => t.key === e.key);
        if (tool) {
            handleTool(tool.id);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, activeScenario, tools]);

  const handleTool = (toolId: string) => {
    if (gameOver) return;
    
    if (toolId === activeScenario.tool) {
      playSound('success');
      setScore(s => s + 1);
      setCombo(c => c + 1);
      setFeedback({ type: 'hit', text: '¡Salvado!' });
      setTimeout(() => setFeedback(null), 800);
      
      setActiveScenario(null); 
      const bonus = combo > 2 ? 10 : 0;
      onComplete(XP_REWARDS.GUARDIA_SAVE + bonus); 
    } else {
      playSound('error');
      setCombo(0);
      setFeedback({ type: 'miss', text: '-20 Salud' });
      setTimeout(() => setFeedback(null), 800);
      setPatientHealth(h => h - 20); 
    }
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
        <Siren size={80} className="text-red-500 mb-4 animate-pulse" />
        <h2 className="text-4xl font-black mb-2">¡PACIENTE PERDIDO!</h2>
        <p className="text-xl mb-4">Has salvado a {score} personas.</p>
        {score > 5 && <p className="text-yellow-400 font-bold mb-8 animate-bounce">¡Gran trabajo bajo presión!</p>}
        <div className="flex gap-4">
          <button onClick={onExit} autoFocus className="bg-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-600 focus:ring-4 focus:ring-gray-500">Salir</button>
          <button onClick={() => { setGameOver(false); setScore(0); setCombo(0); setActiveScenario(null); }} className="bg-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-700 focus:ring-4 focus:ring-red-500">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-800 text-white flex flex-col">
      <div className="bg-slate-900 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center font-bold text-xl"><Siren className="mr-2 text-red-500 animate-pulse"/> GUARDIA DE EMERGENCIAS</div>
        <div className="flex gap-4">
            {combo > 1 && (
                <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full font-black animate-pulse shadow-lg transform scale-110">
                    {combo}x COMBO!
                </div>
            )}
            <div className="bg-slate-700 px-4 py-1 rounded-full font-mono">Salvas: {score}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className={`absolute inset-0 bg-red-500/10 transition-opacity duration-200 ${timeLeft < 3 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>

        {feedback && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-20 text-4xl font-black z-50 animate-out fade-out slide-out-to-top-10 duration-700 ${feedback.type === 'hit' ? 'text-green-400' : 'text-red-500'}`}>
                {feedback.text}
            </div>
        )}

        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center mb-8 relative z-10">
          <div className="mb-4 flex justify-center">{activeScenario?.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{activeScenario?.text}</h3>
          
          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden mt-4">
            <div className={`h-full transition-all duration-100 ease-linear ${patientHealth < 30 ? 'bg-red-600' : 'bg-green-500'}`} style={{ width: `${patientHealth}%` }} />
          </div>
          <p className="text-xs mt-1 text-gray-400">Constantes Vitales</p>
          
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono text-xl px-3 py-1 rounded border border-slate-700">
            {timeLeft.toFixed(1)}s
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl relative z-10">
          {tools.map(t => (
            <button 
              key={t.id} 
              onClick={() => handleTool(t.id)}
              className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 focus:bg-slate-500 p-4 rounded-xl flex flex-col items-center transition-colors border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400"
              aria-label={`Herramienta ${t.label}, Tecla ${t.key}`}
            >
              <div className="flex justify-between w-full mb-1">
                 <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400 font-mono">{t.key}</span>
                 <div className="text-slate-300">{t.icon}</div>
                 <span></span>
              </div>
              <span className="font-bold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <button onClick={onExit} className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 z-50 focus:outline-none focus:ring-2 focus:ring-white rounded-full"><XCircle /></button>
    </div>
  );
});