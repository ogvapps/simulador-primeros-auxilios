import React, { memo, useState, useEffect, useRef } from 'react';
import { 
    Phone, Volume2, XCircle, Play, ExternalLink, CheckCircle2, ArrowLeft, ArrowRight,
    Activity, ThumbsDown, ThumbsUp, AlertOctagon, Clock, Star, ListChecks, RotateCcw,
    MapPin, HeartPulse, Siren, Navigation, BrainCircuit, CalendarClock, Sparkles, Brain, Lock, Loader2
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { EMERGENCY_STEPS, ROLEPLAY_SCENARIOS, FULL_EXAM, MIN_PASS_SCORE, XP_REWARDS, EXAM_QUESTIONS, FLASHCARDS_DATA } from '../../constants';
import { playSound } from '../../utils';
import { Module } from '../../types';
import { SpeakButton } from '../UI';
import { Button, Card, Badge } from '../DesignSystem';
import { RcpGame, BotiquinGame, HeimlichGame, SequenceGame, Chat112Game, TriageGame } from '../games/MiniGames';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const EmergencyView = memo(({ onExit }: { onExit: () => void }) => {
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    const [metroActive, setMetroActive] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Init GPS
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error(err),
                { enableHighAccuracy: true }
            );
        }

        // Init Speech
        if (window.speechSynthesis) {
            const u = new SpeechSynthesisUtterance("Modo Héroe Activado. Mantén la calma.");
            u.lang = 'es-ES';
            window.speechSynthesis.speak(u);
        }

        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const toggleMetronome = () => {
        if (metroActive) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            setMetroActive(false);
        } else {
            setMetroActive(true);
            if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            const beat = () => {
                if (!audioCtxRef.current) return;
                const osc = audioCtxRef.current.createOscillator();
                const gain = audioCtxRef.current.createGain();
                osc.connect(gain);
                gain.connect(audioCtxRef.current.destination);
                osc.frequency.value = 1000;
                gain.gain.setValueAtTime(1, audioCtxRef.current.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
                osc.start(audioCtxRef.current.currentTime);
                osc.stop(audioCtxRef.current.currentTime + 0.1);
                
                // Visual Pulse via navigator.vibrate if available
                if (navigator.vibrate) navigator.vibrate(50);
            };

            // 110 BPM = ~545ms interval
            beat();
            intervalRef.current = window.setInterval(beat, 545);
        }
    };

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-yellow-400 flex flex-col font-mono overflow-y-auto animate-in zoom-in duration-300">
            {/* Header: Tactical */}
            <div className="bg-black border-b-4 border-yellow-500 p-4 flex justify-between items-center sticky top-0 z-20 shadow-xl">
                <div className="flex items-center gap-3">
                    <Siren className="text-red-600 animate-pulse" size={32} />
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white hidden md:block">EMERGENCIA <span className="text-red-600">REAL</span></h1>
                    <h1 className="text-xl font-black uppercase tracking-tighter text-white md:hidden">SOS <span className="text-red-600">REAL</span></h1>
                </div>
                <button onClick={onExit} className="bg-slate-800 text-white px-4 py-2 rounded border border-slate-600 font-bold hover:bg-slate-700">SALIR</button>
            </div>

            <div className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col gap-6">
                
                {/* GPS Panel */}
                <div className="bg-slate-800 p-6 rounded-xl border-2 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="bg-blue-900/50 p-4 rounded-full text-blue-400 animate-pulse flex-shrink-0">
                            <MapPin size={40} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-slate-400 text-xs md:text-sm uppercase tracking-widest mb-1">Tu Ubicación (Léela al 112)</p>
                            {coords ? (
                                <p className="text-2xl md:text-5xl font-black text-white tabular-nums tracking-tight break-all md:break-normal">
                                    {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                                </p>
                            ) : (
                                <p className="text-xl text-yellow-600 animate-pulse">Buscando señal GPS...</p>
                            )}
                        </div>
                    </div>
                    <a href="tel:112" className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white text-xl md:text-2xl font-black py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 transform active:scale-95 transition-all">
                        <Phone size={32} /> LLAMAR 112
                    </a>
                </div>

                {/* RCP Metronome */}
                <button 
                    onClick={toggleMetronome}
                    className={`w-full p-8 rounded-xl border-4 flex items-center justify-center gap-6 transition-all transform active:scale-95 ${metroActive ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-slate-800 border-slate-600 hover:bg-slate-700'}`}
                >
                    <HeartPulse size={64} className={metroActive ? 'text-white' : 'text-slate-500'} />
                    <div className="text-left">
                        <h2 className={`text-2xl md:text-4xl font-black uppercase ${metroActive ? 'text-white' : 'text-slate-400'}`}>
                            {metroActive ? 'RITMO RCP ACTIVO' : 'ACTIVAR METRÓNOMO'}
                        </h2>
                        <p className={`text-sm md:text-lg font-bold ${metroActive ? 'text-red-200' : 'text-slate-500'}`}>
                            110 Compresiones / Minuto
                        </p>
                    </div>
                </button>

                {/* Tactical Guide Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                    {EMERGENCY_STEPS.map((step, idx) => (
                        <div 
                            key={idx} 
                            className={`rounded-xl p-6 border-l-8 cursor-pointer active:opacity-80 transition-opacity bg-slate-800 border-slate-600 hover:bg-slate-750`}
                            onClick={() => speak(`${step.title}. ${step.text}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl md:text-2xl font-black text-white">{step.title}</h2>
                                <Volume2 size={24} className="text-slate-500" />
                            </div>
                            <p className="text-lg md:text-xl text-yellow-400 font-bold leading-snug">{step.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
});

export const LearningModule = ({ module, onComplete, onBack }: { module: Module, onComplete: () => void, onBack: () => void }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [gameDone, setGameDone] = useState(false);
  const [showAiExplanation, setShowAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Micro-Test States
  const [showMicroTest, setShowMicroTest] = useState(false);
  const [microTestQuestion, setMicroTestQuestion] = useState<{q: string, a: boolean} | null>(null);
  const [microTestLoading, setMicroTestLoading] = useState(false);
  
  const currentContent = module.content?.steps[step] || {title: '...', text: '', icon: <Activity size={64} className="text-gray-300" />};
  const isGameStep = !!currentContent.interactiveComponent;
  const canAdvance = !isGameStep || gameDone;
  const totalSteps = module.content?.steps.length || 0;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => setGameDone(false), [step]);

  // AI FUNCTIONS
  const getAi = () => {
     try {
         return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
     } catch (e) {
         console.error(e);
         return null;
     }
  };

  const handleExplainAI = async () => {
    if (showAiExplanation) {
        setShowAiExplanation(null);
        return;
    }
    setAiLoading(true);
    try {
        const ai = getAi();
        if (!ai) throw new Error("No AI");
        const resp = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Explica en 2 frases sencillas, para un alumno de secundaria, por qué es médicamente importante este paso de primeros auxilios: "${currentContent.title} - ${currentContent.text}". Sé curioso y didáctico.`
        });
        setShowAiExplanation(resp.text || "No se pudo generar la explicación.");
    } catch (e) {
        setShowAiExplanation("Error al conectar con el tutor IA.");
    } finally {
        setAiLoading(false);
    }
  };

  const handleNext = async () => {
      // 30% chance to trigger micro-test if not a game step and not the last step
      // Also ensure we haven't just done one (simple random check for now)
      if (!isGameStep && step < totalSteps - 1 && Math.random() < 0.3) {
          setMicroTestLoading(true);
          try {
              const ai = getAi();
              if (!ai) throw new Error("No AI");
              
              const resp = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: `Genera UNA pregunta de Verdadero/Falso basada en este texto: "${currentContent.text}". El objetivo es comprobar si el alumno lo ha leído.`,
                  config: {
                      responseMimeType: "application/json",
                      responseSchema: {
                          type: Type.OBJECT,
                          properties: {
                              q: { type: Type.STRING },
                              a: { type: Type.BOOLEAN } // True for Verdadero, False for Falso
                          },
                          required: ["q", "a"]
                      }
                  }
              });
              
              const json = JSON.parse(resp.text || "{}");
              if (json.q) {
                  setMicroTestQuestion(json);
                  setShowMicroTest(true);
              } else {
                  // Fallback if AI fails to generate JSON
                  proceed();
              }
          } catch (e) {
              console.error(e);
              proceed();
          } finally {
              setMicroTestLoading(false);
          }
      } else {
          proceed();
      }
  };

  const proceed = () => {
      playSound('click');
      if (step < totalSteps - 1) setStep(s => s + 1);
      else onComplete();
  };

  const handleMicroTestAnswer = (answer: boolean) => {
      if (!microTestQuestion) return;
      if (answer === microTestQuestion.a) {
          playSound('success');
          setShowMicroTest(false);
          setMicroTestQuestion(null);
          proceed();
      } else {
          playSound('error');
          // Shake effect or feedback could go here
          alert("¡Incorrecto! Lee de nuevo el paso.");
          setShowMicroTest(false); // Close to let them read again
          setMicroTestQuestion(null);
      }
  };

  return (
    <div className="max-w-4xl mx-auto w-full relative">
      {/* MICRO TEST OVERLAY */}
      {(microTestLoading || showMicroTest) && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur flex items-center justify-center rounded-3xl animate-in fade-in">
              {microTestLoading ? (
                  <div className="text-center">
                      <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4"/>
                      <p className="text-purple-600 font-bold animate-pulse">Generando reto...</p>
                  </div>
              ) : (
                  <div className="max-w-md w-full p-8 text-center animate-in zoom-in">
                      <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock size={40} className="text-purple-600"/>
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 mb-2">{t('microTestTitle')}</h3>
                      <p className="text-gray-500 mb-6">{t('microTestDesc')}</p>
                      
                      <div className="bg-white border-2 border-purple-100 p-6 rounded-xl shadow-sm mb-8">
                          <p className="text-lg font-bold text-gray-800">{microTestQuestion?.q}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <Button variant="success" size="lg" onClick={() => handleMicroTestAnswer(true)}>Verdadero</Button>
                          <Button variant="danger" size="lg" onClick={() => handleMicroTestAnswer(false)}>Falso</Button>
                      </div>
                  </div>
              )}
          </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[600px] transition-all duration-300">
        
        <div className="bg-red-600 p-6 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 relative z-10">
                <button onClick={onBack} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-black leading-none truncate">{module.title}</h2>
                    <p className="text-red-100 text-sm mt-1 font-medium truncate">{module.description}</p>
                </div>
            </div>
            <div className="bg-red-800/50 px-3 py-1 md:px-4 md:py-2 rounded-full font-mono font-bold text-xs md:text-sm backdrop-blur-sm border border-red-500/30 flex-shrink-0 ml-4">
                {step + 1} / {totalSteps}
            </div>
        </div>

        <div className="w-full bg-gray-100 h-2">
            <div className="h-full bg-red-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {module.content?.videoUrls?.[0] && step === 0 && (
                <a href={module.content.videoUrls[0]} target="_blank" rel="noreferrer" className="w-full md:w-auto mb-8">
                    <Button variant="secondary" className="w-full" leftIcon={<Play size={20}/>} rightIcon={<ExternalLink size={16}/>}>
                        Ver Vídeo Explicativo
                    </Button>
                </a>
            )}

            <div className="w-full max-w-2xl text-center">
                <div className="mb-8 transform hover:scale-105 transition-transform duration-300 inline-block p-6 bg-gray-50 rounded-full shadow-inner border border-gray-100">
                    {React.cloneElement(currentContent.icon as React.ReactElement, { size: 80 })}
                </div>
                
                <h3 className="text-2xl md:text-4xl font-black text-gray-800 mb-6 leading-tight flex flex-col md:flex-row items-center justify-center gap-3">
                    {currentContent.title}
                    <div className="flex">
                        <SpeakButton text={`${currentContent.title}. ${currentContent.text}`} />
                        <button 
                            onClick={handleExplainAI} 
                            disabled={aiLoading}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 ml-1 transition-all" 
                            title={t('aiTutorBtn')}
                        >
                            {aiLoading ? <Loader2 size={20} className="animate-spin"/> : <Sparkles size={20} />}
                        </button>
                    </div>
                </h3>
                
                {/* AI Explanation Box */}
                {showAiExplanation && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-left text-indigo-900 mb-6 animate-in slide-in-from-top-2">
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-1 flex items-center gap-2"><Brain size={16}/> {t('aiTutorTitle')}</h4>
                        <p className="text-sm md:text-base">{showAiExplanation}</p>
                    </div>
                )}

                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                    {currentContent.text}
                </p>

                {isGameStep && (
                    <div className="w-full bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                         {currentContent.interactiveComponent === 'RcpGame' && <RcpGame onComplete={() => setGameDone(true)} />}
                         {currentContent.interactiveComponent === 'BotiquinGame' && <BotiquinGame onComplete={() => setGameDone(true)} />}
                         {currentContent.interactiveComponent === 'HeimlichGame' && <HeimlichGame onComplete={() => setGameDone(true)} />}
                         {currentContent.interactiveComponent === 'SequenceGame_PAS' && <SequenceGame onComplete={() => setGameDone(true)} />}
                         {currentContent.interactiveComponent === 'Chat112Game' && <Chat112Game onComplete={() => setGameDone(true)} />}
                         {currentContent.interactiveComponent === 'TriageGame' && <TriageGame onComplete={() => setGameDone(true)} />}
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center sticky bottom-0 z-10">
            <Button variant="ghost" onClick={onBack}>Cancelar</Button>
            <Button 
                onClick={handleNext} 
                disabled={!canAdvance}
                variant="primary"
                size="lg"
                rightIcon={step === totalSteps - 1 ? <CheckCircle2 size={24} /> : <ArrowRight size={24} />}
            >
                {step === totalSteps - 1 ? 'Completar' : 'Siguiente'}
            </Button>
        </div>
      </div>
    </div>
  );
};

// Spaced Repetition (Leitner System) Logic
const BOX_INTERVALS = [0, 1, 3, 7, 14, 30]; // Days for each box

export const FlashcardComponent = ({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) => {
    const { progress, updateProgress } = useGame();
    const [queue, setQueue] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    
    // Load queue based on dates
    useEffect(() => {
        const storedData = progress.flashcardData || {};
        const now = Date.now();
        const dueIndices: number[] = [];

        FLASHCARDS_DATA.forEach((_, idx) => {
            const cardData = storedData[idx];
            // If no data (new card) OR due time is passed
            if (!cardData || cardData.nextReview <= now) {
                dueIndices.push(idx);
            }
        });

        // Shuffle
        dueIndices.sort(() => Math.random() - 0.5);
        setQueue(dueIndices);
        if (dueIndices.length === 0) setShowEmpty(true);
    }, [progress.flashcardData]);

    const handleResponse = (isCorrect: boolean) => {
        const cardIndex = queue[currentIndex];
        const storedData = progress.flashcardData || {};
        const currentBox = storedData[cardIndex]?.box || 0;

        let newBox = isCorrect ? Math.min(currentBox + 1, 5) : 1; // Correct -> Move up, Wrong -> Reset to 1
        
        // Calculate next review date
        const daysToAdd = BOX_INTERVALS[newBox];
        const nextDate = Date.now() + (daysToAdd * 24 * 60 * 60 * 1000);

        const newData = {
            ...storedData,
            [cardIndex]: { box: newBox, nextReview: nextDate }
        };

        // Save immediately
        updateProgress('flashcardData', newData);
        playSound(isCorrect ? 'success' : 'error');

        // Next card
        if (currentIndex < queue.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowEmpty(true);
            onComplete();
        }
    };

    const currentCardIdx = queue[currentIndex];
    const currentCard = FLASHCARDS_DATA[currentCardIdx];
    const cardProgress = progress.flashcardData?.[currentCardIdx];
    const boxLevel = cardProgress?.box || 0;

    if (showEmpty) {
        return (
            <Card className="max-w-xl mx-auto text-center p-8 animate-in zoom-in" padding="lg">
                <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">¡Todo Repasado!</h2>
                <p className="text-gray-500 mb-6">No tienes tarjetas pendientes para hoy. Vuelve mañana para fortalecer tu memoria.</p>
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                    <p className="text-sm font-bold text-blue-800">Estadísticas Rápidas</p>
                    <p className="text-xs text-blue-600 mt-1">Has revisado {queue.length} conceptos hoy.</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button onClick={onBack} variant="outline">Volver</Button>
                    <Button onClick={() => {
                        // Force review all mode
                        const all = FLASHCARDS_DATA.map((_, i) => i);
                        setQueue(all);
                        setShowEmpty(false);
                        setCurrentIndex(0);
                    }} variant="primary" leftIcon={<RotateCcw size={16}/>}>Repasar Todo (Extra)</Button>
                </div>
            </Card>
        );
    }

    if (currentCardIdx === undefined) return null;

    return (
        <div className="max-w-xl mx-auto p-4 flex flex-col h-[calc(100vh-120px)] md:h-[600px]">
            <div className="bg-emerald-600 p-4 rounded-t-xl text-white flex justify-between items-center shadow-md shrink-0">
                <button onClick={onBack} className="hover:bg-emerald-700 p-2 rounded"><ArrowLeft /></button>
                <div className="flex flex-col items-center">
                    <h2 className="font-bold text-lg flex items-center"><BrainCircuit className="mr-2"/> Repaso Inteligente</h2>
                </div>
                <div className="text-right">
                    <span className="text-xs opacity-80 block">Pendientes</span>
                    <span className="font-mono font-bold">{queue.length - currentIndex}</span>
                </div>
            </div>
            
            <div className="flex-1 bg-gray-100 p-6 flex flex-col items-center justify-center relative perspective-1000">
                
                {/* Level Indicator */}
                <div className="absolute top-4 right-4 z-10">
                    <Badge variant="info" icon={<CalendarClock size={12}/>} size="sm">Nivel {boxLevel}/5</Badge>
                </div>

                <div 
                    onClick={() => !isFlipped && setIsFlipped(true)}
                    className="cursor-pointer w-full h-80 relative transition-all duration-500 transform-style-3d group"
                >
                    {/* Front */}
                    <div className={`absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center backface-hidden transition-all duration-500 border-2 border-emerald-100 ${isFlipped ? 'opacity-0 rotate-y-180 pointer-events-none' : 'opacity-100 rotate-y-0'}`}>
                        <span className="text-emerald-500 text-sm font-bold uppercase tracking-wider mb-4">Pregunta</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{currentCard.q}</h3>
                        <p className="mt-8 text-gray-400 text-sm flex items-center animate-pulse"><RotateCcw size={16} className="mr-2" /> Toca para ver respuesta</p>
                    </div>

                    {/* Back */}
                    <div className={`absolute inset-0 bg-emerald-500 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center backface-hidden transition-all duration-500 border-2 border-emerald-600 ${isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 -rotate-y-180 pointer-events-none'}`}>
                        <span className="text-emerald-200 text-sm font-bold uppercase tracking-wider mb-4">Respuesta</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{currentCard.a}</h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-b-xl border-t shadow-lg shrink-0">
                {!isFlipped ? (
                    <Button fullWidth onClick={() => setIsFlipped(true)} variant="primary" size="lg">
                        Mostrar Respuesta
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            onClick={() => handleResponse(false)} 
                            variant="danger" 
                            leftIcon={<RotateCcw size={18}/>}
                        >
                            Difícil
                            <span className="block text-[10px] opacity-70 font-normal">Reiniciar nivel</span>
                        </Button>
                        <Button 
                            onClick={() => handleResponse(true)} 
                            variant="success" 
                            rightIcon={<CheckCircle2 size={18}/>}
                        >
                            Fácil
                            <span className="block text-[10px] opacity-70 font-normal">Siguiente repaso: {BOX_INTERVALS[Math.min(boxLevel + 1, 5)]} días</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const RoleplayGame = ({ scenarioData, onComplete, onBack }: { scenarioData: any, onComplete: () => void, onBack: () => void }) => {
  const scenario = scenarioData;
  const [currentNodeId, setCurrentNodeId] = useState(scenario.startNode);
  const [history, setHistory] = useState<string[]>([]);
  const currentNode = scenario.nodes[currentNodeId];
  const handleOption = (option: any) => { playSound('click'); setHistory([...history, currentNodeId]); setCurrentNodeId(option.next); };
  const handleRestart = () => { setCurrentNodeId(scenario.startNode); setHistory([]); };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden min-h-[500px] flex flex-col">
      <div className="bg-violet-700 p-4 text-white flex items-center shadow-md">
        <button onClick={onBack} className="mr-4 hover:bg-violet-800 p-2 rounded transition-colors"><ArrowLeft /></button>
        <div><h2 className="text-xl font-bold flex items-center"><Activity className="mr-2" />{scenario.title}</h2><p className="text-violet-200 text-xs">Simulador de decisiones</p></div>
      </div>
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4">{currentNode.isFailure ? <XCircle size={64} className="mx-auto text-red-500 animate-bounce" /> : currentNode.isSuccess ? <CheckCircle2 size={64} className="mx-auto text-green-500 animate-bounce" /> : <Activity size={48} className="mx-auto text-violet-400" />}</div>
            <h3 className="text-xl text-gray-800 font-medium leading-relaxed mb-2">{currentNode.text}</h3>
            <div className="mt-2 flex justify-center"><SpeakButton text={currentNode.text} /></div>
        </div>
        <div className="mt-8 w-full max-w-md space-y-3">
            {currentNode.options && currentNode.options.map((opt: any, idx: number) => (
                <button key={idx} onClick={() => handleOption(opt)} className="w-full text-left p-4 bg-white border-2 border-violet-100 hover:border-violet-500 hover:bg-violet-50 rounded-xl transition-all shadow-sm hover:shadow-md font-medium text-gray-700 flex items-center justify-between group"><span>{opt.text}</span><ArrowRight size={16} className="text-violet-300 group-hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" /></button>
            ))}
            {currentNode.isFailure && <div className="animate-in zoom-in duration-300"><div className="text-red-600 font-bold mb-4 flex items-center justify-center"><ThumbsDown className="mr-2"/> Decisión incorrecta</div><Button fullWidth variant="secondary" onClick={() => { playSound('click'); handleRestart(); }}>Intentar de nuevo</Button></div>}
            {currentNode.isSuccess && <div className="animate-in zoom-in duration-300"><div className="text-green-600 font-bold mb-4 flex items-center justify-center"><ThumbsUp className="mr-2"/> ¡Caso Resuelto!</div><Button fullWidth variant="success" onClick={() => { playSound('success'); onComplete(); }}>Completar Módulo</Button></div>}
        </div>
      </div>
    </div>
  );
};

export const ExamComponent = ({ onComplete, onBack }: { onComplete: (score: number, passed: boolean) => void, onBack: () => void }) => {
  const [mode, setMode] = useState<'normal' | 'hardcore' | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [failedReason, setFailedReason] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 

  const timerRef = useRef<number>();

  useEffect(() => {
      if (mode === 'hardcore' && !finished) {
          timerRef.current = window.setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      setFailedReason("¡Tiempo agotado!");
                      setFinished(true);
                      playSound('error');
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(timerRef.current);
  }, [mode, finished]);

  const handleSelect = (opt: string) => { 
      playSound('click'); 
      setAnswers(prev => ({ ...prev, [qIndex]: opt })); 
      
      if (mode === 'hardcore') {
          const currentQuestion = FULL_EXAM[qIndex];
          if (currentQuestion.isCritical && opt !== currentQuestion.a) {
              setFailedReason("¡Error Crítico! Has fallado un concepto vital.");
              setFinished(true);
              playSound('error');
          }
      }
  };
  
  const finish = () => {
    let s = 0;
    FULL_EXAM.forEach((q, i) => { if (answers[i] === q.a) s++; });
    setScore(s);
    setFinished(true);
    const passed = s >= MIN_PASS_SCORE;
    
    if (mode === 'hardcore' && !passed) {
        setFailedReason("Puntuación insuficiente para el modo experto.");
    }

    if (passed && !failedReason) playSound('fanfare');
    else playSound('error');
    
    if (mode === 'normal' || (mode === 'hardcore' && passed && !failedReason)) {
        onComplete(s, passed);
    }
  };

  if (!mode) {
      return (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-700 p-6 text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">Examen Final</h2>
                  <p className="opacity-80">Elige tu desafío</p>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                  <button onClick={() => setMode('normal')} className="p-6 border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 transition-all text-center group">
                      <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <CheckCircle2 size={32} className="text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Modo Normal</h3>
                      <p className="text-sm text-gray-500">Sin límite de tiempo. Puedes revisar tus respuestas al final. Ideal para aprobar.</p>
                  </button>

                  <button onClick={() => { setMode('hardcore'); playSound('alarm'); }} className="p-6 border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-500 transition-all text-center group relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">EXPERTO</div>
                      <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <AlertOctagon size={32} className="text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Modo Hardcore</h3>
                      <p className="text-sm text-gray-500">60 segundos. Sin ayudas. <strong>Un error crítico te suspende inmediatamente.</strong></p>
                  </button>
              </div>
              <div className="bg-gray-50 p-4 text-center">
                  <Button variant="ghost" onClick={onBack}>Volver</Button>
              </div>
          </div>
      );
  }

  if (finished) {
    const passed = score >= MIN_PASS_SCORE && !failedReason;
    return (
      <Card className="max-w-3xl mx-auto animate-in zoom-in" padding="lg">
        <div className="text-center mb-8">
          {passed ? <CheckCircle2 size={80} className="mx-auto text-green-500 mb-4 animate-bounce"/> : <XCircle size={80} className="mx-auto text-red-500 mb-4 animate-pulse"/>}
          <h2 className="text-4xl font-bold mb-2 text-gray-800">{passed ? '¡Aprobado!' : (mode === 'hardcore' ? '¡HAS FALLADO!' : 'Inténtalo de nuevo')}</h2>
          
          {failedReason ? (
              <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg my-4 font-bold">
                  {failedReason}
              </div>
          ) : (
              <p className="text-xl text-gray-600">Has acertado <span className="font-bold text-gray-900">{score}</span> de {FULL_EXAM.length}</p>
          )}
          
          {passed && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 font-bold inline-flex items-center"><Star className="mr-2 text-yellow-500"/> +{XP_REWARDS.EXAM_PASS} XP conseguidos</div>}
        </div>
        
        {(mode === 'normal' || passed) && (
            <div className="mb-8"><h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center"><ListChecks className="mr-2"/> Revisión de respuestas</h3><div className="space-y-4">{EXAM_QUESTIONS.map((q, i) => { const isCorrect = answers[i] === q.a; return (<div key={i} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}><div className="flex items-start justify-between"><p className="font-bold text-gray-800 text-sm mb-2">{i + 1}. {q.q}</p>{isCorrect ? <CheckCircle2 size={20} className="text-green-600 flex-shrink-0"/> : <XCircle size={20} className="text-red-600 flex-shrink-0"/>}</div><div className="text-sm"><p className={`mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700 line-through opacity-70'}`}>Tu respuesta: {answers[i]}</p>{!isCorrect && (<p className="text-green-700 font-semibold mb-1">Correcta: {q.a}</p>)}<p className="text-gray-600 text-xs mt-2 italic bg-white/50 p-2 rounded">💡 {q.expl}</p></div></div>); })}</div></div>
        )}

        <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={onBack}>Volver al Inicio</Button>
            {!passed && <Button variant="secondary" onClick={() => { setFinished(false); setScore(0); setAnswers({}); setQIndex(0); setFailedReason(null); setTimeLeft(60); }}>Reintentar</Button>}
        </div>
      </Card>
    );
  }

  const question = FULL_EXAM[qIndex];
  const isLast = qIndex === FULL_EXAM.length - 1;

  return (
    <div className={`max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border-t-8 ${mode === 'hardcore' ? 'border-red-600' : 'border-indigo-600'}`}>
      <div className="flex justify-between mb-4 text-sm text-gray-500 items-center">
          <span>Pregunta {qIndex + 1} de {FULL_EXAM.length}</span>
          {mode === 'hardcore' && (
              <span className={`text-2xl font-mono font-bold flex items-center ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                  <Clock size={20} className="mr-2" /> {timeLeft}s
              </span>
          )}
          {mode === 'normal' && <span>Mínimo: {MIN_PASS_SCORE}</span>}
      </div>
      
      <div className="h-2 bg-gray-100 rounded-full mb-6"><div className={`h-full rounded-full transition-all ${mode === 'hardcore' ? 'bg-red-600' : 'bg-indigo-600'}`} style={{ width: `${((qIndex + 1) / FULL_EXAM.length) * 100}%` }} /></div>
      
      <h3 className="text-xl font-bold mb-6">{question.q}</h3>
      {mode === 'hardcore' && question.isCritical && (
          <div className="mb-4 flex items-center text-red-600 text-xs font-bold uppercase tracking-wider bg-red-50 p-2 rounded border border-red-200">
              <AlertOctagon size={16} className="mr-2" /> Pregunta Crítica - Fallar es fatal
          </div>
      )}

      <div className="space-y-3 mb-8">
          {question.opts.map(opt => (
              <button 
                key={opt} 
                onClick={() => handleSelect(opt)} 
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${answers[qIndex] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
              >
                  {opt}
              </button>
          ))}
      </div>
      
      <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setQIndex(i => i - 1)} disabled={qIndex === 0 || mode === 'hardcore'}>
              {mode === 'hardcore' ? 'Sin retroceso' : 'Anterior'}
          </Button>
          {isLast ? (
              <Button variant="success" onClick={finish} disabled={!answers[qIndex]}>Finalizar</Button>
          ) : (
              <Button variant={mode === 'hardcore' ? 'danger' : 'secondary'} onClick={() => setQIndex(i => i + 1)} disabled={!answers[qIndex]}>Siguiente</Button>
          )}
      </div>
    </div>
  );
};