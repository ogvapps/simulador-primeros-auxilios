import React, { useState, useRef, memo, useEffect } from 'react';
import { PhoneIcon, HeartPulse, XCircle, CheckCircle2, Volume2, Target, ChevronRight, Send, AlertTriangle, ShieldCheck, HelpCircle, BriefcaseMedical, Scissors, Droplets, Thermometer, Ban } from 'lucide-react';

// --- CHAT 112 GAME ---
export const Chat112Game = memo(({ onComplete, playSound }) => {
  const [messages, setMessages] = useState([{ text: "Emergencias 112, ¿dígame?", sender: 'bot' }]);
  const [options, setOptions] = useState([
    { text: "¡Ayuda! ¡Hay un accidente en el patio!", correct: true },
    { text: "Hola, quería pedir una pizza.", correct: false },
    { text: "No sé qué pasa, adiós.", correct: false }
  ]);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const botReply = (text, delay = 1000, nextOptions = []) => {
    setIsTyping(true);
    setOptions([]);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { text, sender: 'bot' }]);
      if (nextOptions) setOptions(nextOptions);
      if (playSound) playSound('success'); // Soft notification sound
    }, delay);
  };

  const handleOption = (opt) => {
    if (playSound) playSound('click');
    setMessages(prev => [...prev, { text: opt.text, sender: 'user' }]);
    setOptions([]); // Hide options while processing

    if (!opt.correct) {
      if (playSound) playSound('error');
      setTimeout(() => {
        botReply("Esto es una línea de EMERGENCIA. Por favor, ¿tiene una emergencia real?", 600, options); // Re-show original options or handle retry
      }, 500);
      return;
    }

    // Flow logic
    if (step === 0) {
      setIsTyping(true);
      setTimeout(() => {
        botReply("¿Hay heridos? ¿Están conscientes?", 1000, [
          { text: "No lo sé, me da miedo mirar.", correct: false },
          { text: "Sí, uno está en el suelo y no se mueve.", correct: true }
        ]);
        setStep(1);
      }, 500);
    } else if (step === 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: "Entendido. Enviamos una ambulancia. No cuelgue y compruebe si respira.", sender: 'bot' }]);
        setCompleted(true);
        if (playSound) playSound('success');
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="mx-auto border-[10px] border-slate-900 rounded-[3rem] overflow-hidden bg-white w-[360px] h-[720px] shadow-2xl flex flex-col relative ring-8 ring-slate-900/10 transform hover:scale-[1.01] transition-transform duration-500">
      {/* Notch & Status Bar */}
      <div className="bg-slate-900 text-white pt-3 pb-2 px-6 flex justify-between items-end text-[10px] font-medium z-20">
        <span>11:22</span>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl flex justify-center items-center">
          <div className="w-16 h-1 bg-slate-800 rounded-full mb-1"></div>
        </div>
        <div className="flex gap-1.5 opacity-90">
          <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
          <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center gap-4 z-10 shadow-sm sticky top-0">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
          <PhoneIcon size={18} fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-800 text-sm">Emergencias 112</div>
          <div className="text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">00:24</div>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
          <Volume2 size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex flex-col gap-3 scroll-smooth">
        <div className="text-center text-[10px] text-slate-400 font-medium py-2">Hoy</div>

        {messages.map((m, i) => (
          <div key={i} className={`flex w-full ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div className={`px-4 py-3 max-w-[85%] text-sm shadow-sm animate-in zoom-in duration-300 origin-bottom leading-relaxed ${m.sender === 'bot'
              ? 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-200/50'
              : 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-blue-200'
              }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/50 shadow-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}

        {completed && (
          <div className="flex justify-center mt-4 mb-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-xl shadow-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Ambulancia en camino
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Options Area */}
      <div className="bg-white p-2 min-h-[160px] pb-6 border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10">
        {!completed ? (
          <div className="flex flex-col gap-2 p-2">
            {options.length > 0 ? options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt)}
                className="w-full text-left px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm text-xs font-semibold text-slate-700 active:scale-[0.98] transition-all hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 flex justify-between items-center group"
              >
                <span className="line-clamp-2">{opt.text}</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Send size={12} className="ml-0.5" />
                </div>
              </button>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 py-8">
                <div className="w-12 h-1 bg-slate-100 rounded-full"></div>
                <p className="text-[10px] font-medium uppercase tracking-widest">Esperando respuesta...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full pb-4">
            <button onClick={onComplete} className="text-white bg-slate-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center gap-2">
              <span>Finalizar Llamada</span>
              <PhoneIcon size={16} className="rotate-135" />
            </button>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-2 pointer-events-none">
        <div className="w-32 h-1.5 bg-slate-900/20 rounded-full"></div>
      </div>
    </div>
  );
});

// --- RCP GAME ---
export const RcpGame = memo(({ onComplete, playSound }) => {
  const [active, setActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [instantRate, setInstantRate] = useState(0); // For visual feedback
  const clicksRef = useRef(0);
  const startTimeRef = useRef(0);

  // Constants
  const TARGET_CPM_MIN = 100;
  const TARGET_CPM_MAX = 120;

  const start = () => {
    if (completed) return;
    playSound('click');
    setActive(true);
    setClicks(0);
    setResult(null);
    clicksRef.current = 0;
    startTimeRef.current = Date.now();
    setLastClickTime(0);

    setTimeout(() => {
      finishGame();
    }, 10000); // 10 seconds test
  };

  const finishGame = () => {
    setActive(false);
    const cpm = clicksRef.current * 6; // 10s * 6 = 60s
    const success = cpm >= 100 && cpm <= 130; // Giving a bit of margin
    setResult({ cpm, success });
    if (success) {
      playSound('success');
      setCompleted(true);
    } else {
      playSound('error');
    }
  };

  const handleClick = () => {
    if (!active) return;

    const now = Date.now();
    clicksRef.current++;
    setClicks(clicksRef.current);
    playSound('click'); // Short distinctive click or beat sound ideally

    // Calculate instant CPM for visual feedback
    if (lastClickTime > 0) {
      const delta = now - lastClickTime;
      const currentCPM = 60000 / delta;
      setInstantRate(currentCPM);
    }
    setLastClickTime(now);
  };

  // Determine heart color/state based on instant rate
  const getHeartStatus = () => {
    if (instantRate === 0) return 'text-slate-300 scale-100';
    if (instantRate < TARGET_CPM_MIN) return 'text-yellow-500 scale-95'; // Too slow
    if (instantRate > TARGET_CPM_MAX + 10) return 'text-orange-500 scale-110'; // Too fast
    return 'text-green-500 scale-105 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]'; // Perfect
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-red-50 p-8 rounded-[2rem] text-center border border-red-100 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Ritmo Cardíaco</h3>
      <p className="text-slate-500 text-sm mb-6 relative z-10">Mantén el ritmo entre 100-120 pulsaciones.</p>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px]">
        {!active && !result && (
          <button onClick={start} className="group relative">
            <div className="absolute inset-0 bg-red-400 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-rose-600 text-white w-48 h-48 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-105 transition-transform">
              <HeartPulse size={64} className="mb-2" />
              <span className="font-bold text-lg">INICIAR</span>
              <span className="text-xs opacity-80">(10 segundos)</span>
            </div>
          </button>
        )}

        {active && (
          <div className="relative">
            {/* Visual Metronome Hint (optional, or just feedback) */}
            <button
              onClick={handleClick}
              className={`w-64 h-64 rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-8 transition-all duration-100 active:scale-95 touch-manipulation cursor-pointer select-none ${instantRate > 0 && (instantRate < 100 || instantRate > 130) ? 'border-yellow-400' : 'border-red-100 hover:border-red-200'
                }`}
            >
              <HeartPulse
                size={100}
                className={`transition-all duration-150 ${getHeartStatus()}`}
                fill="currentColor"
                fillOpacity={0.2}
              />
              <span className="text-4xl font-black text-slate-900 mt-2 font-mono">{clicks}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Compresiones</span>
            </button>

            {/* Feedback Label */}
            <div className="absolute -bottom-12 left-0 right-0 text-center h-8">
              {instantRate > 0 && (
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${instantRate >= 100 && instantRate <= 130 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {instantRate < 100 ? '¡MÁS RÁPIDO!' : instantRate > 130 ? '¡MÁS DESPACIO!' : '¡PERFECTO!'}
                </span>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl ${result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {result.success ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
            </div>

            <h2 className={`text-4xl font-black mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {Math.round(result.cpm)} CPM
            </h2>
            <p className="text-slate-600 font-medium mb-8 max-w-xs text-center">
              {result.success
                ? '¡Excelente! Has mantenido el flujo sanguíneo vital.'
                : 'Ritmo inadecuado. Intenta seguir el ritmo de "La Macarena".'}
            </p>

            <div className="flex gap-4">
              {!result.success && (
                <button onClick={start} className="px-6 py-3 rounded-xl bg-white border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Intentar de nuevo
                </button>
              )}
              {result.success && (
                <button onClick={onComplete} className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <span>Siguiente</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// --- HEIMLICH GAME ---
export const HeimlichGame = memo(({ onComplete, playSound }) => {
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleZoneClick = (zone) => {
    if (completed) return;

    if (zone === 'correct') {
      playSound('success');
      setFeedback('correct');
      setCompleted(true);
    } else {
      playSound('error');
      setFeedback('error');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-md mx-auto text-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-2xl"></div>
      <div className="absolute top-20 -left-10 w-24 h-24 bg-yellow-50 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <h3 className="font-bold text-2xl text-slate-800 mb-2">Maniobra de Heimlich</h3>
        <p className="text-slate-500 text-sm mb-6">Indica el punto exacto donde aplicar la compresión abdominal.</p>

        <div className="relative group mx-auto w-64 h-80 my-4 select-none">
          {/* Silhouette SVG */}
          <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-lg">
            {/* Body base */}
            <path d="M60,40 Q100,20 140,40 Q170,80 160,130 Q180,180 160,280 L40,280 Q20,180 40,130 Q30,80 60,40 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="3" />

            {/* Ribcage hint (subtle) */}
            <path d="M70,100 Q100,90 130,100" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

            {/* Sternum hint */}
            <line x1="100" y1="80" x2="100" y2="130" stroke="#e2e8f0" strokeWidth="2" />

            {/* Navel hint */}
            <circle cx="100" cy="190" r="3" fill="#cbd5e1" />

            {/* Interactive Zones */}

            {/* Chest (Wrong) */}
            <path
              d="M60,60 Q100,50 140,60 L130,110 Q100,100 70,110 Z"
              fill="transparent"
              className="cursor-pointer hover:fill-red-500/20 transition-all"
              onClick={() => handleZoneClick('chest')}
            />

            {/* Correct Zone (Between navel and sternum) */}
            <path
              d="M75,135 Q100,125 125,135 L120,165 Q100,175 80,165 Z"
              fill="transparent"
              className="cursor-pointer hover:fill-green-500/30 transition-all animate-pulse"
              onClick={() => handleZoneClick('correct')}
            />

            {/* Lower Abdomen (Wrong) */}
            <path
              d="M60,190 Q100,180 140,190 L135,240 Q100,250 65,240 Z"
              fill="transparent"
              className="cursor-pointer hover:fill-red-500/20 transition-all"
              onClick={() => handleZoneClick('low')}
            />
          </svg>

          {/* Hand Hint Overlay */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity">
            <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center">
              <Target size={24} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="h-16 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="flex flex-col w-full animate-in zoom-in">
              <button
                onClick={onComplete}
                className="bg-emerald-500 text-white px-8 py-3 rounded-xl w-full hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} /> Continuar
              </button>
            </div>
          )}
          {feedback === 'error' && (
            <div className="text-red-500 font-bold flex items-center bg-red-50 px-6 py-2 rounded-full animate-shake border border-red-100">
              <XCircle className="mr-2" size={18} /> ¡Ahí no! Busca la boca del estómago.
            </div>
          )}
          {!feedback && !completed && <div className="text-slate-400 text-sm animate-pulse">Haz clic en la zona correcta</div>}
        </div>
      </div>
    </div>
  );
});

// --- BOTIQUIN GAME ---
export const BotiquinGame = memo(({ onComplete, playSound }) => {
  const CORRECTS = ['Guantes', 'Gasas', 'Antiséptico', 'Tijeras', 'Suero'];

  // Mapped items with Icons
  const ALL_ITEMS = [
    { name: 'Guantes', icon: <BriefcaseMedical />, type: 'correct' },
    { name: 'Gasas', icon: <Ban className="rotate-45" />, type: 'correct' }, // Mocking gauze icon
    { name: 'Antiséptico', icon: <Droplets />, type: 'correct' },
    { name: 'Tijeras', icon: <Scissors />, type: 'correct' },
    { name: 'Suero', icon: <Thermometer />, type: 'correct' },
    { name: 'Alcohol', icon: <Ban />, type: 'wrong' },
    { name: 'Algodón', icon: <Ban />, type: 'wrong' },
    { name: 'Pomada', icon: <Ban />, type: 'wrong' }
  ];

  // Shuffle on mount
  const [items] = useState(() =>
    ALL_ITEMS.sort(() => Math.random() - 0.5)
  );

  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState(null);
  const [completed, setCompleted] = useState(false);

  const toggle = (item) => {
    if (completed) return;

    // Determine new selection state
    const isSelected = selected.some(s => s.name === item.name);
    let newSelected;

    if (isSelected) {
      newSelected = selected.filter(i => i.name !== item.name);
      if (playSound) playSound('click');
      setMsg(null);
    } else {
      if (selected.length >= 5) {
        if (playSound) playSound('error');
        return;
      }
      newSelected = [...selected, item];
      if (playSound) playSound('click');
    }

    setSelected(newSelected);

    // Auto-Check
    if (newSelected.length === 5) {
      const isCorrect = newSelected.every(i => i.type === 'correct');
      if (isCorrect) {
        if (playSound) playSound('success');
        setMsg({ type: 'success', text: '¡Botiquín Perfecto!' });
        setCompleted(true);
      } else {
        if (playSound) playSound('error');
        setMsg({ type: 'error', text: 'Sobran o faltan cosas...' });
      }
    } else {
      setMsg(null);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-xl max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Monta tu Botiquín</h3>
          <p className="text-xs text-slate-500">Selecciona los 5 esenciales.</p>
        </div>
        <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-sm font-bold text-slate-600">
          {selected.length}/5
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {items.map((item, idx) => {
          const isSelected = selected.some(s => s.name === item.name);
          return (
            <button
              key={idx}
              onClick={() => toggle(item)}
              disabled={completed && !isSelected}
              className={`
                relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2 aspect-square transition-all duration-300
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-100 ring-offset-2'
                  : 'bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-100 shadow-sm'
                }
                ${completed && !isSelected ? 'opacity-20 grayscale' : ''}
            `}
            >
              <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{item.name}</span>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      <div className="min-h-[4rem]">
        {!completed && msg && (
          <div className={`p-3 rounded-xl text-center text-sm font-bold animate-shake ${msg.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {msg.text}
          </div>
        )}

        {completed && (
          <button
            onClick={onComplete}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 animate-in zoom-in"
          >
            <CheckCircle2 size={20} />
            <span className="mt-0.5">Continuar</span>
          </button>
        )}
      </div>
    </div>
  );
});

// --- SEQUENCE GAME ---
export const SequenceGame = memo(({ onComplete, playSound }) => {
  const correctOrder = ['P', 'A', 'S'];
  const [sequence, setSequence] = useState([]);
  const [completed, setCompleted] = useState(false);

  const handlePress = (letter) => {
    if (completed) return;
    if (playSound) playSound('click');

    const newSeq = [...sequence, letter];
    setSequence(newSeq);

    // Immediate check
    if (newSeq[newSeq.length - 1] !== correctOrder[newSeq.length - 1]) {
      playSound('error');
      setSequence([]); // Reset on error
      return;
    }

    if (newSeq.length === 3) {
      playSound('success');
      setCompleted(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center max-w-md mx-auto">
      <h3 className="font-bold text-2xl text-slate-800 mb-2">Protocolo P.A.S.</h3>
      <p className="text-slate-500 mb-8">Pulsa en el orden correcto de actuación.</p>

      {/* Slots */}
      <div className="flex justify-center gap-3 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-20 h-24 rounded-2xl flex items-center justify-center text-3xl font-black border-4 border-dashed transition-all duration-300 ${sequence[i]
            ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105 rotate-1'
            : 'bg-slate-50 border-slate-200 text-slate-300'
            }`}>
            {sequence[i] || (i + 1)}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {['S', 'P', 'A'].map(l => {
          const isUsed = sequence.includes(l);
          return (
            <button
              key={l}
              onClick={() => handlePress(l)}
              disabled={completed || isUsed}
              className={`w-16 h-16 rounded-2xl font-black text-2xl shadow-lg transition-all duration-200 flex items-center justify-center
                ${isUsed
                  ? 'bg-slate-100 text-slate-300 scale-90 shadow-none'
                  : 'bg-white text-slate-700 hover:-translate-y-1 hover:shadow-xl border-b-4 border-slate-200 active:border-b-0 active:translate-y-0'
                }
            `}
            >
              {l}
            </button>
          )
        })}
      </div>

      {completed && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={onComplete}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl w-full hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> Continuar
          </button>
        </div>
      )}
    </div>
  );
});

// --- TRIAGE GAME ---
export const TriageGame = memo(({ onComplete, playSound }) => {
  const [completed, setCompleted] = useState(false);
  const [wrongShake, setWrongShake] = useState(null);

  const victims = [
    { id: 1, text: "Inconsciente (respira mal)", subtext: "Prioridad Inmediata", type: 'rojo', icon: <AlertTriangle size={32} className="text-red-100" /> },
    { id: 2, text: "Grita de dolor (pierna)", subtext: "Puede esperar", type: 'amarillo', icon: <Volume2 size={32} className="text-orange-100" /> },
    { id: 3, text: "Camina mareado", subtext: "Leve", type: 'verde', icon: <Target size={32} className="text-green-100" /> },
  ];

  const handleTriage = (victim) => {
    if (completed) return;
    if (victim.type === 'rojo') {
      playSound('success');
      setCompleted(true);
    } else {
      playSound('error');
      setWrongShake(victim.id);
      setTimeout(() => setWrongShake(null), 600);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/60 shadow-xl max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 leading-tight">Accidente Múltiple</h3>
          <p className="text-xs text-slate-500 font-medium">¿A quién atiendes PRIMERO?</p>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-3">
          {victims.map(v => (
            <button
              key={v.id}
              onClick={() => handleTriage(v)}
              className={`
                 w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 text-left group
                 ${wrongShake === v.id ? 'animate-shake bg-red-50 border-red-300' : 'bg-white border-transparent hover:border-blue-200 hover:shadow-md shadow-sm border'}
              `}
            >
              <div className={`p-3 rounded-xl transition-colors ${v.type === 'rojo' ? 'bg-red-500 group-hover:bg-red-600' :
                v.type === 'amarillo' ? 'bg-orange-400 group-hover:bg-orange-500' : 'bg-green-500 group-hover:bg-green-600'
                }`}>
                {v.icon}
              </div>
              <div>
                <div className="font-bold text-slate-700 text-sm group-hover:text-blue-700">{v.text}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{v.subtext}</div>
              </div>
              <ChevronRight className="ml-auto text-slate-300 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" size={16} />
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-in zoom-in duration-300">
          <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-extrabold text-green-800 text-lg mb-1">¡Correcto!</h4>
            <p className="text-green-700/80 text-sm leading-relaxed">
              Siempre prioriza la vida en peligro inmediato (inconsciencia, asfixia, hemorragia masiva).
            </p>
          </div>
          <button
            onClick={onComplete}
            className="bg-slate-900 text-white px-6 py-4 rounded-xl w-full hover:bg-slate-800 font-bold shadow-xl transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <span>Siguiente Nivel</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
});

export const MiniGames = { Chat112Game, RcpGame, HeimlichGame, BotiquinGame, SequenceGame, TriageGame };
