import React, { useState, useEffect, memo, useRef } from 'react';
import { Siren, XCircle, HeartPulse, FileSpreadsheet, User, ArrowRight, Zap, Volume2, Droplets, Wind, Frown, Timer, Activity, Skull } from 'lucide-react';
import { XP_REWARDS } from '../../data/constants';

// MOCK SOUND if not provided (should be handled by parent)
const defaultPlaySound = (type) => console.log(`Audio: ${type}`);

const GuardiaGame = memo(({ onComplete, onExit, playSound = defaultPlaySound }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [patientHealth, setPatientHealth] = useState(100);
  const [activeScenario, setActiveScenario] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);


  // Scenarios Data - Expanded to 20 scenarios
  const scenarios = [
    { id: 's1', text: "¡Varón inconsciente, NO respira!", tool: "rcp", icon: <HeartPulse size={48} className="text-red-500 animate-pulse" />, hint: "RCP Inmediata" },
    { id: 's2', text: "¡Corte profundo en brazo, sangrado masivo!", tool: "venda", icon: <Droplets size={48} className="text-red-600 drop-shadow-lg" />, hint: "Compresión Directa" },
    { id: 's3', text: "¡Atragantamiento, manos al cuello!", tool: "heimlich", icon: <Wind size={48} className="text-blue-400" />, hint: "Maniobra Heimlich" },
    { id: 's4', text: "¡Mareo, palidez, sudor frío!", tool: "piernas", icon: <Frown size={48} className="text-yellow-400" />, hint: "Posición Antishock" },
    { id: 's5', text: "¡Parada cardiaca confirmada!", tool: "desa", icon: <Zap size={48} className="text-yellow-500 animate-pulse" />, hint: "Usar DESA" },
    { id: 's6', text: "¡Mujer embarazada con hemorragia!", tool: "venda", icon: <Droplets size={48} className="text-red-500" />, hint: "Compresión y 112" },
    { id: 's7', text: "¡Niño ahogándose con comida!", tool: "heimlich", icon: <Wind size={48} className="text-blue-500" />, hint: "Heimlich Pediátrico" },
    { id: 's8', text: "¡Anciano con dolor torácico intenso!", tool: "telefono", icon: <Volume2 size={48} className="text-red-600" />, hint: "Llamar 112" },
    { id: 's9', text: "¡Deportista desmayado en el suelo!", tool: "piernas", icon: <Frown size={48} className="text-yellow-500" />, hint: "Posición Antishock" },
    { id: 's10', text: "¡Víctima de electrocución sin pulso!", tool: "desa", icon: <Zap size={48} className="text-yellow-600 animate-pulse" />, hint: "DESA + RCP" },
    { id: 's11', text: "¡Herida en pierna, sangre a borbotones!", tool: "venda", icon: <Droplets size={48} className="text-red-700" />, hint: "Torniquete" },
    { id: 's12', text: "¡Bebé no responde, labios azules!", tool: "rcp", icon: <HeartPulse size={48} className="text-red-600 animate-pulse" />, hint: "RCP Infantil" },
    { id: 's13', text: "¡Persona convulsionando en el suelo!", tool: "telefono", icon: <Volume2 size={48} className="text-orange-500" />, hint: "Proteger y 112" },
    { id: 's14', text: "¡Motorista inconsciente tras accidente!", tool: "telefono", icon: <Volume2 size={48} className="text-red-500" />, hint: "No mover, 112" },
    { id: 's15', text: "¡Ahogamiento en piscina, sin respiración!", tool: "rcp", icon: <HeartPulse size={48} className="text-blue-500 animate-pulse" />, hint: "RCP Inmediata" },
    { id: 's16', text: "¡Quemadura grave en brazo y pecho!", tool: "telefono", icon: <Volume2 size={48} className="text-orange-600" />, hint: "Enfriar y 112" },
    { id: 's17', text: "¡Diabético con hipoglucemia severa!", tool: "telefono", icon: <Volume2 size={48} className="text-purple-500" />, hint: "Azúcar y 112" },
    { id: 's18', text: "¡Fractura expuesta en pierna!", tool: "telefono", icon: <Volume2 size={48} className="text-red-400" />, hint: "Inmovilizar y 112" },
    { id: 's19', text: "¡Reacción alérgica, dificultad respiratoria!", tool: "telefono", icon: <Volume2 size={48} className="text-pink-500" />, hint: "112 Urgente" },
    { id: 's20', text: "¡Golpe de calor, temperatura muy alta!", tool: "piernas", icon: <Frown size={48} className="text-orange-400" />, hint: "Enfriar y elevar" },
  ];

  const tools = [
    { id: "rcp", label: "RCP", icon: <HeartPulse />, color: 'hover:bg-red-600 hover:border-red-400' },
    { id: "venda", label: "Compresión", icon: <FileSpreadsheet />, color: 'hover:bg-red-700 hover:border-red-500' },
    { id: "heimlich", label: "Heimlich", icon: <User />, color: 'hover:bg-blue-600 hover:border-blue-400' },
    { id: "piernas", label: "Elevar Piernas", icon: <ArrowRight className="-rotate-45" />, color: 'hover:bg-yellow-600 hover:border-yellow-400' },
    { id: "desa", label: "DESA", icon: <Zap />, color: 'hover:bg-yellow-500 hover:border-yellow-300' },
    { id: "telefono", label: "Llamar 112", icon: <Volume2 />, color: 'hover:bg-slate-600 hover:border-slate-400' },
  ];

  // Game Loop
  useEffect(() => {
    if (gameOver) return;

    // Initialize first scenario
    if (!activeScenario) {
      nextScenario();
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          endGame();
          return 0;
        }
        return prev - 0.1;
      });
      setPatientHealth(prev => {
        if (prev <= 0) {
          endGame();
          return 0;
        }
        return Math.max(0, prev - (score > 5 ? 1.2 : 0.8)); // Harder over time
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activeScenario, gameOver, score]);

  const nextScenario = () => {
    const random = scenarios[Math.floor(Math.random() * scenarios.length)];
    setActiveScenario(random);
    // Diffculty scaling: faster time as score increases
    const newTime = Math.max(3, 10 - score * 0.4);
    setTimeLeft(newTime);
    setPatientHealth(Math.min(100, patientHealth + 10)); // Heal a bit on success
    playSound('alarm');
  };

  const endGame = () => {
    setGameOver(true);
    if (patientHealth <= 0 || timeLeft <= 0) {
      playSound('error'); // Game Over sound
    }
    // Track that user played Guardia mode
    if (onComplete) onComplete(score); // Pass score to parent for tracking
  };

  const handleTool = (toolId) => {
    if (gameOver) return;

    if (toolId === activeScenario.tool) {
      playSound('success');
      setScore(s => s + 1);
      setActiveScenario(null); // Will trigger nextScenario in effect or we can call direct, but relying on effect deps is tricky if null.
      // Better to call direct for immediate response feel
      setTimeout(nextScenario, 50);
    } else {
      playSound('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPatientHealth(h => h - 25); // Heavy penalty
      setTimeLeft(t => Math.max(0, t - 2)); // Time penalty
    }
  };

  if (gameOver) {
    // Calculate XP: 20 XP per person saved
    const xpEarned = score * 20;

    return (
      <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border-2 border-slate-700 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center relative overflow-hidden animate-in zoom-in duration-300">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-500/20">
            {score > 0 ? <Activity size={48} className="text-green-500" /> : <Skull size={48} className="text-red-500" />}
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            {score > 0 ? 'TURNO COMPLETADO' : 'PACIENTE PERDIDO'}
          </h2>
          <p className="text-slate-400 mb-4 font-medium">
            Has logrado salvar a <span className="text-white text-2xl font-bold">{score}</span> personas.
          </p>

          {/* XP Reward Display */}
          {score > 0 && (
            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Zap size={24} className="fill-yellow-400" />
                <span className="text-3xl font-black">+{xpEarned} XP</span>
              </div>
              <p className="text-yellow-200 text-sm mt-1">20 XP por cada persona salvada</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (onComplete && score > 0) onComplete(score);
                onExit();
              }}
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white py-4 rounded-xl font-bold transition-all"
            >
              ACEPTAR
            </button>
            <button
              onClick={() => { setGameOver(false); setScore(0); setPatientHealth(100); setActiveScenario(null); }}
              className="bg-red-600 text-white hover:bg-red-700 py-4 rounded-xl font-bold shadow-lg shadow-red-900/40 transition-all active:scale-95"
            >
              REINTENTAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[50] bg-slate-950 text-white flex flex-col font-sans selection:bg-red-500 selection:text-white ${shake ? 'animate-shake' : ''} overflow-y-auto`}>

      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30 animate-pulse">
            <Siren className="text-red-500" size={24} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wider leading-none">URGENCIAS</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Modo Guardia</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-full px-5 py-2 border border-slate-700 flex items-center gap-3">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Salvas</span>
          <span className="text-xl font-black text-white">{score}</span>
        </div>

        <button onClick={onExit} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          <XCircle size={20} />
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center p-4 pb-8 relative z-10 w-full max-w-4xl mx-auto">

        {/* Patient Monitor Card */}
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 mb-8 shadow-2xl relative overflow-hidden group">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0 opacity-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Icon & Timer */}
            <div className="flex flex-col items-center gap-4 min-w-[120px]">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center shadow-inner border border-slate-700/50">
                {activeScenario?.icon}
              </div>
              <div className={`font-mono text-2xl font-black px-4 py-1 rounded-lg border-2 ${timeLeft < 3
                ? 'bg-red-950/50 border-red-500 text-red-500 animate-pulse'
                : 'bg-slate-950/50 border-green-900 text-green-400'
                }`}>
                {timeLeft.toFixed(1)}s
              </div>
            </div>

            {/* Info & Health */}
            <div className="flex-1 w-full text-center md:text-left">
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1 block animate-pulse">¡Nueva Emergencia!</span>
              <h2 className="text-2xl md:text-3xl font-black leading-tight mb-2 md:mb-4">{activeScenario?.text}</h2>

              {/* Health Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>Integridad Paciente</span>
                  <span className={patientHealth < 30 ? 'text-red-500' : 'text-slate-300'}>{Math.round(patientHealth)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 relative">
                  <div
                    className={`h-full transition-all duration-200 ease-out ${patientHealth < 30 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                      patientHealth < 60 ? 'bg-yellow-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      }`}
                    style={{ width: `${patientHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {tools.map(t => (
            <button
              key={t.id}
              onClick={() => handleTool(t.id)}
              className={`
                        group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800 border-2 border-slate-700 
                        transition-all duration-200 active:scale-95 hover:shadow-lg hover:shadow-black/20
                        ${t.color} hover:text-white text-slate-400
                    `}
            >
              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-200">
                {React.cloneElement(t.icon, { size: 32 })}
              </div>
              <span className="font-bold text-sm tracking-wide">{t.label}</span>

              {/* Corner accents */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white/50 transition-colors"></div>
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white/50 transition-colors"></div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
});

export default GuardiaGame;
