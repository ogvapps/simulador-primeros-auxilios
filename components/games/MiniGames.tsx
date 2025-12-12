import React, { memo, useState, useEffect, useRef } from 'react';
import { Volume2, XCircle, Droplets, HeartPulse, Send, Phone, Video, MoreVertical, BatteryCharging, Wifi, Signal } from 'lucide-react';
import { playSound } from '../../utils';

export const Chat112Game = memo(({ onComplete }: { onComplete: () => void }) => {
  const [messages, setMessages] = useState<{text: string, sender: 'bot' | 'user', time: string}[]>([
      { text: "Emergencias 112, ¿dígame?", sender: 'bot', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [options, setOptions] = useState([
    { text: "¡Ayuda! ¡Hay un accidente en el patio!", correct: true },
    { text: "Hola, quería pedir una pizza.", correct: false },
    { text: "No sé qué pasa, adiós.", correct: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getTime = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  const addBotMessage = (text: string, nextOptions?: any[], nextStep?: number, finish: boolean = false) => {
      setIsTyping(true);
      setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { text, sender: 'bot', time: getTime() }]);
          playSound('click'); 
          if (nextOptions) setOptions(nextOptions);
          if (nextStep !== undefined) setStep(nextStep);
          if (finish) {
              setCompleted(true);
              playSound('success');
              onComplete();
          }
      }, 1500);
  };

  const handleOption = (opt: any) => {
    playSound('click');
    setMessages(prev => [...prev, { text: opt.text, sender: 'user', time: getTime() }]);
    setOptions([]); 
    
    if (!opt.correct) {
      playSound('error');
      addBotMessage("Por favor, necesito que se calme y me diga qué ocurre. Esto es una línea de emergencias.", [
          ...options
      ]);
      return; 
    }

    if (step === 0) {
       addBotMessage("¿Hay heridos? ¿Están conscientes?", [
           { text: "No lo sé, me da miedo mirar.", correct: false },
           { text: "Sí, uno está en el suelo y no se mueve.", correct: true }
       ], 1);
    } else if (step === 1) {
       addBotMessage("Entendido. Enviamos una ambulancia. No cuelgue y compruebe si respira.", [], undefined, true);
    }
  };

  return (
    <div className="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800 max-w-sm w-full mx-auto h-[70vh] min-h-[450px] max-h-[700px] flex flex-col relative overflow-hidden">
       {/* Notch / Status Bar */}
       <div className="absolute top-0 left-0 w-full h-7 bg-transparent z-20 flex justify-between px-6 items-center text-[10px] text-white font-medium pt-2">
            <span>{getTime()}</span>
            <div className="flex gap-1">
                <Signal size={10} />
                <Wifi size={10} />
                <BatteryCharging size={10} />
            </div>
       </div>

       {/* App Header */}
       <div className="bg-emerald-600 pt-8 pb-3 px-4 flex items-center justify-between shadow-md z-10 rounded-t-[1rem] md:rounded-t-[1.5rem]">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 border-2 border-emerald-100">
                    <span className="text-xl">🚑</span>
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">112 Emergencias</h3>
                    <p className="text-emerald-100 text-[10px] animate-pulse">En línea</p>
                </div>
            </div>
            <div className="flex text-white gap-3 opacity-80">
                <Video size={18} />
                <Phone size={18} />
                <MoreVertical size={18} />
            </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto flex flex-col gap-2 relative">
         <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a4a4a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="bg-yellow-100 text-[10px] text-center p-1 rounded shadow-sm text-gray-600 mb-2 self-center px-3 z-0">
             Las llamadas a este número son grabadas.
         </div>

         {messages.map((m, i) => (
           <div key={i} className={`z-0 max-w-[85%] rounded-lg p-2 shadow-sm text-sm relative ${m.sender === 'bot' ? 'bg-white self-start rounded-tl-none' : 'bg-[#dcf8c6] self-end rounded-tr-none'}`}>
             <p className="text-gray-800 leading-snug">{m.text}</p>
             <span className="text-[10px] text-gray-500 float-right mt-1 ml-2 flex items-center gap-0.5">
                 {m.time} {m.sender === 'user' && <span className="text-blue-500">✓✓</span>}
             </span>
           </div>
         ))}
         
         {isTyping && (
             <div className="bg-white p-2 rounded-lg rounded-tl-none self-start shadow-sm w-14 flex items-center justify-center gap-1 z-0">
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
         )}
         <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="bg-[#f0f2f5] p-2 flex flex-col gap-2 rounded-b-[1rem] md:rounded-b-[1.5rem]">
         {completed ? (
            <div className="text-center text-green-600 font-bold text-xs bg-green-100 p-2 rounded-lg border border-green-200">
                ✅ Protocolo activado correctamente
            </div>
         ) : options.length > 0 ? (
             <div className="flex flex-col gap-1">
                 {options.map((opt, i) => (
                   <button key={i} onClick={() => handleOption(opt)} className="bg-white p-3 rounded-xl text-xs font-medium text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm border border-gray-200 text-left flex items-center justify-between group">
                     {opt.text}
                     <Send size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                   </button>
                 ))}
             </div>
         ) : (
             <div className="text-center text-xs text-gray-400 italic py-2">Esperando respuesta...</div>
         )}
       </div>
    </div>
  );
});

export const TriageGame = memo(({ onComplete }: { onComplete: () => void }) => {
  const [victims, setVictims] = useState([
    { id: 'A', status: 'Gritando de dolor', icon: <Volume2 size={32} className="text-orange-500"/>, severity: 3 },
    { id: 'B', status: 'Inconsciente, no responde', icon: <XCircle size={32} className="text-red-500"/>, severity: 1 },
    { id: 'C', status: 'Sangra por el brazo', icon: <Droplets size={32} className="text-red-400"/>, severity: 2 }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<any[]>([]);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  const handleSelect = (victim: any) => {
    if (selectedOrder.find(v => v.id === victim.id) || result) return;
    playSound('click');
    const newOrder = [...selectedOrder, victim];
    setSelectedOrder(newOrder);

    if (newOrder.length === 3) {
      const correct = newOrder[0].severity === 1 && newOrder[1].severity === 2; 
      if (correct) {
        setResult('success');
        playSound('success');
        onComplete();
      } else {
        setResult('fail');
        playSound('error');
      }
    }
  };

  const reset = () => {
    setSelectedOrder([]);
    setResult(null);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
       <p className="mb-4 font-medium text-slate-700">Selecciona a las víctimas en orden de prioridad (1º al más grave):</p>
       <div className="grid grid-cols-1 gap-3 mb-4" role="list">
         {victims.map(v => {
           const isSelected = selectedOrder.find(s => s.id === v.id);
           const index = selectedOrder.indexOf(v);
           return (
             <button 
               key={v.id} 
               onClick={() => handleSelect(v)} 
               disabled={!!isSelected} 
               className={`flex items-center p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'bg-slate-200 border-slate-300 opacity-70' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}
               aria-label={`Víctima: ${v.status}. ${isSelected ? 'Ya seleccionado en posición ' + (index+1) : 'Pulsa para seleccionar.'}`}
             >
               <div className="mr-4 bg-slate-100 p-2 rounded-full">{v.icon}</div>
               <div className="text-left flex-1 font-bold text-slate-700">{v.status}</div>
               {isSelected && <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">#{index + 1}</div>}
             </button>
           );
         })}
       </div>
       {result === 'fail' && <div className="text-center" role="alert"><p className="text-red-600 font-bold mb-2">Orden incorrecto. Recuerda: ¡El silencio mata! (Inconscientes primero)</p><button onClick={reset} className="text-sm underline text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">Reintentar</button></div>}
       {result === 'success' && <div className="text-center text-green-600 font-bold animate-bounce" role="alert">¡Correcto! 1º Inconsciente, 2º Hemorragia, 3º Leve.</div>}
    </div>
  );
});

export const RcpGame = memo(({ onComplete }: { onComplete: () => void }) => {
  const [active, setActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'good' | 'bad'>('idle');
  const clicksRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (active && (e.code === 'Space' || e.code === 'Enter')) {
            e.preventDefault(); 
            handleCompression();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  const start = () => { 
      playSound('click'); 
      setActive(true); 
      setClicks(0); 
      setResult(null); 
      clicksRef.current = 0; 
      lastClickTimeRef.current = 0;
      setTimeout(() => { 
          setActive(false); 
          const cpm = clicksRef.current * 6; 
          const success = cpm >= 100 && cpm <= 130; 
          setResult({ cpm, success }); 
          if (success) { 
              playSound('success'); 
              onComplete(); 
          } else { 
              playSound('error'); 
          } 
      }, 10000); 
  };

  const handleCompression = () => {
      if (!active) return;
      
      const now = Date.now();
      const delta = now - lastClickTimeRef.current;
      lastClickTimeRef.current = now;
      clicksRef.current++;
      setClicks(clicksRef.current);

      if (clicksRef.current > 1) {
          if (delta > 450 && delta < 700) {
              setFeedbackState('good');
              playSound('click'); 
          } else {
              setFeedbackState('bad');
              playSound('error');
          }
      } else {
          playSound('click');
      }

      setTimeout(() => setFeedbackState('idle'), 150);
  };

  return (
    <div className="border-2 border-dashed border-red-300 bg-red-50 p-6 rounded-xl text-center relative overflow-hidden">
      {/* Visual Metronome Background */}
      {active && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="w-64 h-64 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '0.54s' }}></div>
         </div>
      )}

      {!active && !result && <button onClick={start} autoFocus className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 shadow-lg transform transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-red-400 relative z-10">Iniciar Test de Ritmo (10s)</button>}
      
      {active && (
          <div className="flex flex-col items-center relative z-10">
              <p className="text-sm text-gray-500 mb-4 font-mono bg-white/80 px-2 rounded">TIEMPO: 10s</p>
              <p className="text-xs text-gray-400 mb-2">Sigue el latido visual (110 BPM)</p>
              <button 
                onClick={handleCompression} 
                className={`w-48 h-48 rounded-full text-white font-bold text-xl shadow-xl transition-all duration-100 mx-auto flex flex-col items-center justify-center transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-400
                    ${feedbackState === 'good' ? 'bg-green-500 scale-110 shadow-green-200' : 
                      feedbackState === 'bad' ? 'bg-gray-500 scale-95 translate-x-1' : 
                      'bg-red-500 active:scale-95'}`}
              >
                <HeartPulse size={64} className={`mb-2 ${feedbackState === 'idle' ? 'animate-pulse' : ''}`} />
                COMPRIME
                <span className="text-4xl mt-1">{clicks}</span>
              </button>
              <div className="h-8 mt-4 font-bold text-lg" aria-live="polite">
                  {feedbackState === 'good' && <span className="text-green-600 animate-in fade-in slide-in-from-bottom-2">¡Buen Ritmo!</span>}
                  {feedbackState === 'bad' && <span className="text-red-600 animate-in fade-in slide-in-from-bottom-2">¡Ritmo Irregular!</span>}
              </div>
          </div>
      )}
      
      {result && (
          <div className="animate-in zoom-in relative z-10" role="alert">
              <p className={`text-5xl font-black mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.cpm} <span className="text-xl font-normal text-gray-500">cpm</span></p>
              <p className="mb-6 font-medium text-lg">{result.success ? '¡Ritmo Perfecto para salvar una vida!' : 'Ritmo inadecuado. Busca la canción "Macarena" (100-120 cpm).'}</p>
              {!result.success && <button onClick={start} className="bg-white border-2 border-red-600 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">Reintentar</button>}
          </div>
      )}
    </div>
  );
});

export const SequenceGame = memo(({ onComplete }: { onComplete: () => void }) => {
  const STEPS = [
    { id: 'proteger', text: '1. PROTEGER', color: 'bg-blue-100 border-blue-500 text-blue-700' },
    { id: 'avisar', text: '2. AVISAR', color: 'bg-yellow-100 border-yellow-500 text-yellow-700' },
    { id: 'socorrer', text: '3. SOCORRER', color: 'bg-green-100 border-green-500 text-green-700' }
  ];
  
  const [shuffled, setShuffled] = useState([...STEPS].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<any[]>([]);
  const [status, setStatus] = useState('playing');

  const handleSelect = (step: any) => {
    if(status !== 'playing') return;
    playSound('click');
    const newOrder = [...order, step];
    setOrder(newOrder);
    setShuffled(shuffled.filter(s => s.id !== step.id));

    if (newOrder.length === 3) {
      if (newOrder[0].id === 'proteger' && newOrder[1].id === 'avisar' && newOrder[2].id === 'socorrer') {
        setStatus('success');
        playSound('success');
        onComplete();
      } else {
        setStatus('error');
        playSound('error');
        setTimeout(() => {
          setOrder([]);
          setShuffled([...STEPS].sort(() => Math.random() - 0.5));
          setStatus('playing');
        }, 1500);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 text-center">
      <h4 className="font-bold text-gray-700 mb-4">Pulsa los pasos en el orden correcto:</h4>
      <div className="flex gap-2 justify-center mb-8">
        {[0,1,2].map(i => (
          <div key={i} className={`w-1/3 h-16 rounded-lg border-2 border-dashed flex items-center justify-center font-bold text-sm transition-all ${order[i] ? order[i].color + ' border-solid' : 'border-gray-300 bg-gray-50 text-gray-400'}`}>
            {order[i] ? order[i].text : `Paso ${i+1}`}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {shuffled.map(step => (
          <button key={step.id} onClick={() => handleSelect(step)} className={`p-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95 hover:shadow-md border-b-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${step.color.replace('bg-', 'bg-opacity-50 bg-')}`}>{step.text.split('. ')[1]}</button>
        ))}
      </div>
      {status === 'success' && <p className="mt-4 text-green-600 font-bold animate-bounce" role="alert">¡Correcto! P.A.S.</p>}
      {status === 'error' && <p className="mt-4 text-red-500 font-bold" role="alert">¡Orden incorrecto! Reintentando...</p>}
    </div>
  );
});

export const BotiquinGame = memo(({ onComplete }: { onComplete: () => void }) => {
  const CORRECTS = ['Guantes', 'Gasas', 'Clorhexidina', 'Tijeras', 'Suero'];
  const ITEMS = [...CORRECTS, 'Alcohol', 'Algodón', 'Pomada'].sort(() => Math.random() - 0.5);
  const [selected, setSelected] = useState<string[]>([]);
  const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const toggle = (item: string) => { playSound('click'); setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]); };
  const check = () => { const isCorrect = CORRECTS.every(i => selected.includes(i)) && selected.length === CORRECTS.length; if (isCorrect) { playSound('success'); setMsg({ type: 'success', text: '¡Botiquín perfecto!' }); onComplete(); } else { playSound('error'); setMsg({ type: 'error', text: 'Revisa: Falta algo o sobra algo.' }); } };
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="mb-4 font-semibold">Selecciona los 5 elementos esenciales:</p>
      <div className="grid grid-cols-2 gap-2 mb-4">{ITEMS.map(item => <button key={item} onClick={() => toggle(item)} className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected.includes(item) ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}>{item}</button>)}</div>
      <button onClick={check} className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">Comprobar</button>
      {msg && <p className={`mt-2 text-center font-bold ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`} role="alert">{msg.text}</p>}
    </div>
  );
});

export const HeimlichGame = memo(({ onComplete }: { onComplete: () => void }) => {
  const [feedback, setFeedback] = useState<'correct' | 'error' | null>(null);
  const handleZoneClick = (zone: string) => { if (zone === 'correct') { playSound('success'); setFeedback('correct'); onComplete(); } else { playSound('error'); setFeedback('error'); setTimeout(() => setFeedback(null), 1500); }};
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 font-medium">Haz clic en el punto exacto de compresión:</p>
      <svg viewBox="0 0 100 140" className="w-40 h-56 border border-gray-200 bg-white rounded shadow-inner"><path d="M20,10 C20,0 80,0 80,10 L90,100 C90,140 10,140 10,100 Z" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="2" /><rect x="20" y="20" width="60" height="30" fill="transparent" onClick={() => handleZoneClick('chest')} className="cursor-pointer hover:fill-red-100/50" /><rect x="30" y="55" width="40" height="15" fill="transparent" onClick={() => handleZoneClick('correct')} className="cursor-pointer hover:fill-green-100/50" /><rect x="20" y="75" width="60" height="40" fill="transparent" onClick={() => handleZoneClick('low')} className="cursor-pointer hover:fill-red-100/50" /><text x="50" y="90" textAnchor="middle" fontSize="40" fill="rgba(0,0,0,0.1)">?</text></svg>
      <div className="h-8 mt-2" role="alert">{feedback === 'correct' && <span className="text-green-600 font-bold">¡Correcto! Entre ombligo y esternón.</span>}{feedback === 'error' && <span className="text-red-600 font-bold">¡Ahí no! Inténtalo de nuevo.</span>}</div>
    </div>
  );
});