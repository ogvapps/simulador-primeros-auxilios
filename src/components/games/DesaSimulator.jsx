import React, { useState, useEffect, useRef } from 'react';
import {
    Power,
    Activity,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Info,
    X,
    User,
    Volume2,
    VolumeX,
    RefreshCw,
    RotateCw,
    ShieldAlert,
    Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DesaSimulator = ({ onComplete, onBack, playSound, t, lang }) => {
    const [step, setStep] = useState('OFF'); // OFF, POWERING_ON, PLACE_PADS, ANALYZING, SHOCK_ADVISED, SHOCKING, SHOCK_DELIVERED, CPR
    const [patientMode, setPatientMode] = useState('adult'); // adult, pediatric
    const [viewSide, setViewSide] = useState('front'); // front, back (for pediatric)
    const [pads, setPads] = useState({ top: false, bottom: false });
    const [muted, setMuted] = useState(false);
    const [cprCount, setCprCount] = useState(0);
    const [breathCount, setBreathCount] = useState(0);
    const [cprPhase, setCprPhase] = useState('compressing'); // compressing, breathing
    const [cycleCount, setCycleCount] = useState(0);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef(window.speechSynthesis);

    // Voice Engine
    const speak = (text) => {
        if (muted || !text) return;
        const msg = String(text);
        if (synthRef.current) synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        if (synthRef.current) synthRef.current.speak(utterance);
    };

    // Simulation steps configuration
    const steps = {
        'OFF': {
            message: String(t?.desa?.steps?.off || 'Pulse el botón de encendido'),
            instruction: String(t?.desa?.instructions?.off || 'Encender el DESA es el primer paso vital.'),
            color: 'bg-slate-800'
        },
        'POWERING_ON': {
            message: String(t?.desa?.steps?.powerOn || 'Iniciando sistema...'),
            instruction: String(t?.desa?.instructions?.powerOn || 'Escuche atentamente las instrucciones.'),
            color: 'bg-brand-600'
        },
        'PLACE_PADS': {
            message: patientMode === 'adult'
                ? String(t?.desa?.steps?.padsAdult || 'Conecte los electrodos en el tórax desnudo')
                : String(t?.desa?.steps?.padsPedia || 'Conecte los electrodos en PECHO y ESPALDA'),
            instruction: patientMode === 'adult'
                ? String(t?.desa?.instructions?.padsAdult || 'Coloque un parche en hombro derecho y otro en costado izquierdo.')
                : String(t?.desa?.instructions?.padsPedia || 'Coloque un parche en el centro del pecho y otro en el centro de la espalda.'),
            color: 'bg-blue-600'
        },
        'ANALYZING': {
            message: String(t?.desa?.steps?.analyzing || 'Analizando ritmo. No toque al paciente.'),
            instruction: String(t?.desa?.instructions?.analyzing || 'Mantenga las manos alejadas de la víctima.'),
            color: 'bg-yellow-500'
        },
        'SHOCK_ADVISED': {
            message: String(t?.desa?.steps?.shockAdvised || 'Descarga recomendada. Manténgase alejado.'),
            instruction: String(t?.desa?.instructions?.shockAdvised || 'Grite: "¡FUERA TODOS!". El equipo se está cargando.'),
            color: 'bg-orange-600'
        },
        'SHOCKING': {
            message: String(t?.desa?.steps?.shocking || 'Pulse el botón de descarga AHORA'),
            instruction: String(t?.desa?.instructions?.shocking || 'Presione el botón parpadeante inmediatamente.'),
            color: 'bg-red-600'
        },
        'SHOCK_DELIVERED': {
            message: String(t?.desa?.steps?.shockDelivered || 'Descarga realizada. Inicie RCP.'),
            instruction: String(t?.desa?.instructions?.shockDelivered || 'Realice 30 compresiones y 2 insuflaciones.'),
            color: 'bg-green-600'
        },
        'CPR': {
            message: cprPhase === 'compressing'
                ? `${30 - cprCount} Compresiones`
                : `${2 - breathCount} Insuflaciones`,
            instruction: cprPhase === 'compressing'
                ? `Ciclo ${cycleCount + 1}/5: Presione fuerte en el centro del pecho.`
                : `Ciclo ${cycleCount + 1}/5: Incline cabeza, tape nariz e insufle aire.`,
            color: 'bg-brand-500'
        }
    };

    // Auto-switch view side for pediatric back pad
    useEffect(() => {
        if (patientMode === 'pediatric' && pads.top && !pads.bottom && viewSide === 'front') {
            // Optional: Auto flip or wait for user
        }
    }, [pads, patientMode]);

    // Handle voice prompts
    useEffect(() => {
        if (step === 'CPR') {
            if (cprPhase === 'compressing' && cprCount === 0) {
                speak("Inicie treinta compresiones torácicas.");
            } else if (cprPhase === 'breathing' && breathCount === 0) {
                speak("Realice dos insuflaciones.");
            }
        } else if (step !== 'OFF') {
            speak(steps[step]?.message);
        }
    }, [step, cprPhase, patientMode]);

    const handlePower = () => {
        if (step === 'OFF') {
            setStep('POWERING_ON');
            if (!muted) try { playSound('success'); } catch (e) { }
            setTimeout(() => setStep('PLACE_PADS'), 2000);
        } else {
            setStep('OFF');
            setPads({ top: false, bottom: false });
            setCprCount(0);
            setBreathCount(0);
            setCprPhase('compressing');
            setCycleCount(0);
            setSessionsCompleted(0);
            setViewSide('front');
            if (synthRef.current) synthRef.current.cancel();
        }
    };

    const placePad = (position) => {
        if (step !== 'PLACE_PADS') return;

        // Prevent placing back pad if in front view (except for adult)
        if (patientMode === 'pediatric' && viewSide === 'front' && position === 'bottom') return;
        if (patientMode === 'pediatric' && viewSide === 'back' && position === 'top') return;

        const newPads = { ...pads, [position]: true };
        setPads(newPads);

        if (!muted) {
            try { playSound('click'); } catch (e) { }
            speak(position === 'top' ? "Primer electrodo conectado." : "Segundo electrodo conectado.");
        }

        if (newPads.top && newPads.bottom) {
            setTimeout(() => setStep('ANALYZING'), 1500);
        }
    };

    useEffect(() => {
        let t1, t2;
        if (step === 'ANALYZING') {
            t1 = setTimeout(() => {
                if (sessionsCompleted > 0) {
                    speak("Ritmo cardíaco restaurado. No toque al paciente. Espere a los servicios de emergencia.");
                    confetti();
                    if (!muted) try { playSound('fanfare'); } catch (e) { }
                    setTimeout(() => onComplete && onComplete(), 5000);
                    return;
                }
                setStep('SHOCK_ADVISED');
                if (!muted) try { playSound('alarm'); } catch (e) { }
            }, 6000);
        }
        if (step === 'SHOCK_ADVISED') {
            t2 = setTimeout(() => {
                setStep('SHOCKING');
            }, 3000);
        }
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [step]);

    const deliverShock = () => {
        if (step !== 'SHOCKING') return;
        setStep('SHOCK_DELIVERED');
        if (!muted) try { playSound('powerup'); } catch (e) { }
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white z-[100] animate-pulse pointer-events-none opacity-80';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 600);
        setTimeout(() => {
            setStep('CPR');
            setCycleCount(0);
        }, 2500);
    };

    const handleCpr = () => {
        if (step !== 'CPR' || cprPhase !== 'compressing') return;
        if (!muted) try { playSound('success'); } catch (e) { }

        const nextCount = cprCount + 1;
        if (nextCount >= 30) {
            setCprCount(0);
            setCprPhase('breathing');
        } else {
            setCprCount(nextCount);
        }
    };

    const handleBreath = () => {
        if (step !== 'CPR' || cprPhase !== 'breathing') return;
        if (!muted) try { playSound('powerup'); } catch (e) { }

        const nextBreath = breathCount + 1;
        if (nextBreath >= 2) {
            const nextCycle = cycleCount + 1;
            if (nextCycle >= 5) {
                setCprPhase('compressing');
                setBreathCount(0);
                setCprCount(0);
                setCycleCount(0);
                setSessionsCompleted(s => s + 1);
                speak("Pare la RCP. Analizando ritmo cardíaco de nuevo.");
                setTimeout(() => setStep('ANALYZING'), 1000);
            } else {
                setCycleCount(nextCycle);
                setBreathCount(0);
                setCprPhase('compressing');
                setCprCount(0);
                speak(`Ciclo ${nextCycle} completado. Continúe RCP.`);
            }
        } else {
            setBreathCount(nextBreath);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden font-sans select-none">
            {/* AE Header */}
            <div className="flex items-center justify-between p-4 md:p-6 bg-slate-900 border-b border-white/10 shadow-2xl z-20 shrink-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-red-600 rounded-xl md:rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <Activity className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black tracking-tighter leading-none flex items-center gap-2">
                            DESA <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-lg text-[10px] md:text-sm border border-red-500/20">PRO v3</span>
                        </h2>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 md:mt-1">ALS System</p>
                    </div>
                </div>

                {/* CENTRAL INSTRUCTION - LCD Panel */}
                {step !== 'OFF' && (
                    <div className="hidden lg:flex flex-1 max-w-2xl mx-12 bg-black/40 border border-white/5 rounded-2xl p-4 items-center gap-5 animate-in slide-in-from-top-4 shadow-inner">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${steps[step]?.color || 'bg-slate-800'} shadow-lg ring-2 ring-white/5`}>
                            <Volume2 size={24} className={isSpeaking ? 'animate-pulse text-white' : 'text-white/70'} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Voz del DESA</h4>
                            <p className="text-lg font-black text-slate-100 leading-tight truncate">
                                {steps[step]?.instruction}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 md:gap-4">
                    {step === 'OFF' && (
                        <div className="flex bg-slate-800 p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-white/5">
                            <button onClick={() => setPatientMode('adult')} className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all ${patientMode === 'adult' ? 'bg-white text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>ADULTO</button>
                            <button onClick={() => setPatientMode('pediatric')} className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all ${patientMode === 'pediatric' ? 'bg-yellow-500 text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>NIÑO</button>
                        </div>
                    )}

                    <div className="flex bg-slate-800 p-1 rounded-xl md:rounded-2xl border border-white/5">
                        <button onClick={() => setMuted(!muted)} className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all ${muted ? 'text-slate-500 bg-slate-700' : 'text-brand-400 bg-brand-400/10'} hover:scale-105`}>
                            {muted ? <VolumeX size={20} /> : <Volume2 size={20} className={isSpeaking ? 'animate-pulse' : ''} />}
                        </button>
                        <button onClick={onBack} className="p-2 md:p-3 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-4 md:gap-8 overflow-hidden min-h-0">
                {/* Patient Viewport */}
                <div className="flex-[1.5] bg-slate-900/40 rounded-[30px] md:rounded-[60px] border border-white/5 relative flex items-center justify-center overflow-hidden shadow-inner group min-h-[300px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)]"></div>

                    {/* Instruction Overlay for Mobile */}
                    {step !== 'OFF' && (
                        <div className="absolute top-4 left-4 right-4 z-30 lg:hidden pointer-events-none">
                            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${steps[step]?.color || 'bg-slate-800'}`}>
                                    <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''} />
                                </div>
                                <p className="text-xs font-bold text-white line-clamp-2">{steps[step]?.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Patient Figure Container - Scaled based on available space */}
                    <div className={`relative transition-all duration-1000 transform origin-center flex items-center justify-center 
                        ${patientMode === 'adult' ? 'w-[400px] h-[600px] scale-[0.5] sm:scale-[0.7] md:scale-[0.85] lg:scale-100' : 'w-[300px] h-[450px] scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100'} 
                        ${viewSide === 'back' ? 'translate-x-0' : ''}`}>

                        <div className={`w-full h-full relative ${viewSide === 'back' ? 'scale-x-[-1]' : ''}`}>
                            {/* Anatomical Torso - SVG */}
                            <div className="absolute inset-0 z-0">
                                <svg viewBox="0 0 400 600" className={`w-full h-full transition-colors duration-1000 ${step !== 'OFF' ? 'fill-slate-800' : 'fill-slate-900'}`}>
                                    <defs>
                                        <radialGradient id="torsoGrad" cx="50%" cy="40%" r="60%">
                                            <stop offset="0%" stopColor={step !== 'OFF' ? '#2f3542' : '#1e2124'} />
                                            <stop offset="100%" stopColor="#0f172a" />
                                        </radialGradient>
                                    </defs>
                                    <path
                                        d="M100,80 Q200,40 300,80 Q360,120 370,250 Q380,450 330,520 Q280,580 200,580 Q120,580 70,520 Q20,450 30,250 Q40,120 100,80 Z"
                                        fill="url(#torsoGrad)"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth="2"
                                    />
                                    <g className="opacity-20 stroke-slate-400 fill-none" strokeWidth="1">
                                        <path d="M100,90 Q200,120 300,90" />
                                        <path d="M80,220 Q200,260 320,220" />
                                        <path d="M70,280 Q200,320 330,280" />
                                        <path d="M70,340 Q200,380 330,340" />
                                        <rect x="192" y="140" width="16" height="220" rx="8" className="fill-slate-400/10 stroke-none" />
                                    </g>
                                    {viewSide === 'front' && (
                                        <>
                                            <circle cx="120" cy="280" r="4" className="fill-pink-900/40" />
                                            <circle cx="280" cy="280" r="4" className="fill-pink-900/40" />
                                        </>
                                    )}
                                </svg>
                            </div>

                            {/* CPR Press Target */}
                            {step === 'CPR' && cprPhase === 'compressing' && (
                                <div
                                    onClick={handleCpr}
                                    className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 border-brand-500/30 flex items-center justify-center cursor-pointer group/cpr z-50 animate-ping-slow"
                                >
                                    <div className="w-32 h-32 rounded-full bg-brand-500/20 border-4 border-brand-500 flex items-center justify-center group-hover/cpr:scale-110 transition-transform">
                                        <Activity size={48} className="text-brand-400" />
                                    </div>
                                </div>
                            )}

                            {/* Breath Target */}
                            {step === 'CPR' && cprPhase === 'breathing' && (
                                <div
                                    onClick={handleBreath}
                                    className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 border-pink-500/30 flex items-center justify-center cursor-pointer group/breath z-50 animate-ping-slow"
                                >
                                    <div className="w-32 h-32 rounded-full bg-pink-500/20 border-4 border-pink-500 flex items-center justify-center group-hover/breath:scale-110 transition-transform">
                                        <Wind size={48} className="text-pink-400" />
                                    </div>
                                </div>
                            )}

                            {/* Interactive Pads Overlay */}
                            {step === 'PLACE_PADS' && (
                                <>
                                    {patientMode === 'adult' && (
                                        <>
                                            {!pads.top && (
                                                <PadTarget
                                                    onClick={() => placePad('top')}
                                                    className="top-[15%] right-[12%] w-28 h-36"
                                                    label="Hombro Derecho"
                                                />
                                            )}
                                            {!pads.bottom && (
                                                <PadTarget
                                                    onClick={() => placePad('bottom')}
                                                    className="bottom-[28%] left-[10%] w-28 h-36 rotate-[-15deg]"
                                                    label="Costado Izquierdo"
                                                />
                                            )}
                                        </>
                                    )}
                                    {patientMode === 'pediatric' && (
                                        <>
                                            {viewSide === 'front' && !pads.top && (
                                                <PadTarget
                                                    onClick={() => placePad('top')}
                                                    className="top-[30%] left-1/2 -translate-x-1/2 w-24 h-32"
                                                    label="Pecho"
                                                />
                                            )}
                                            {viewSide === 'back' && !pads.bottom && (
                                                <PadTarget
                                                    onClick={() => placePad('bottom')}
                                                    className="top-[30%] left-1/2 -translate-x-1/2 w-24 h-32"
                                                    label="Espalda"
                                                />
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {/* Visual Placed Pads */}
                            {pads.top && (patientMode === 'adult' || viewSide === 'front') && (
                                <div className={`absolute z-20 animate-in zoom-in duration-300 ${patientMode === 'adult' ? 'top-[15%] right-[12%] w-28 h-36 rotate-[10deg]' : 'top-[30%] left-1/2 -translate-x-1/2 w-24 h-32'}`}>
                                    <RealisticPad id="1" />
                                </div>
                            )}
                            {pads.bottom && (patientMode === 'adult' || viewSide === 'back') && (
                                <div className={`absolute z-20 animate-in zoom-in duration-300 ${patientMode === 'adult' ? 'bottom-[28%] left-[10%] w-28 h-36 rotate-[-15deg]' : 'top-[30%] left-1/2 -translate-x-1/2 w-24 h-32'}`}>
                                    <RealisticPad id="2" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pediatric Toggle View */}
                    {patientMode === 'pediatric' && step === 'PLACE_PADS' && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:top-10 md:left-10 md:translate-x-0 flex flex-col gap-2 z-30">
                            <button
                                onClick={() => setViewSide(viewSide === 'front' ? 'back' : 'front')}
                                className="bg-slate-800/80 backdrop-blur text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border border-white/10 flex items-center gap-3 font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl"
                            >
                                <RefreshCw size={18} className={viewSide === 'back' ? 'rotate-180 transition-transform' : ''} />
                                {viewSide === 'front' ? 'Girar a Espalda' : 'Girar a Pecho'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Device Console */}
                <div className="flex-1 bg-slate-800 rounded-[30px] md:rounded-[70px] border-[6px] md:border-[12px] border-slate-700 shadow-[10px_10px_40px_-5px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative min-h-[400px]">
                    {/* Screen Section */}
                    <div className="m-4 md:m-8 flex-1 bg-black rounded-[25px] md:rounded-[45px] border-[10px] md:border-[15px] border-slate-900 shadow-inner relative flex flex-col p-6 md:p-10 overflow-hidden">
                        {/* CRT Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20"></div>

                        {step === 'OFF' ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20">
                                <Power size={48} className="md:size-20 text-slate-700 mb-4" />
                                <span className="text-[10px] md:text-sm text-slate-700 font-bold uppercase tracking-[0.3em] md:tracking-[0.5em]">System Standby</span>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col animate-in fade-in duration-1000">
                                {/* Status Bar */}
                                <div className="flex justify-between items-center mb-6 md:mb-10 text-[8px] md:text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <Activity size={12} className="text-emerald-500" />
                                        <span>Nominal</span>
                                    </div>
                                    <div className="px-2 py-1 bg-slate-900 rounded-full border border-white/5">
                                        {patientMode === 'pediatric' ? 'Pediatric' : 'Adult'}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    {step === 'ANALYZING' && (
                                        <div className="flex gap-2 md:gap-3 h-12 md:h-20 items-end mb-8 md:mb-12">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-2 md:w-4 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 100}ms` }}></div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 'SHOCK_ADVISED' && (
                                        <div className="mb-6 md:mb-10 p-6 md:p-8 bg-orange-500/10 rounded-full border-2 md:border-4 border-orange-500/20 animate-pulse">
                                            <ShieldAlert size={60} className="md:size-[100px] text-orange-500" />
                                        </div>
                                    )}
                                    {step === 'SHOCKING' && <Zap size={80} className="md:size-[140px] text-red-500 mb-6 md:mb-10 animate-flash drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]" />}

                                    {step === 'CPR' && (
                                        <div className="mb-6 md:mb-10">
                                            <div className="text-7xl md:text-[120px] font-black text-brand-400 leading-none tabular-nums tracking-tighter">
                                                {cprPhase === 'compressing' ? 30 - cprCount : 2 - breathCount}
                                            </div>
                                            <div className="text-[10px] md:text-[14px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-brand-200/60 mt-2 md:mt-4">
                                                {cprPhase === 'compressing' ? 'Compresiones' : 'Insuflaciones'}
                                            </div>
                                        </div>
                                    )}

                                    <h3 className={`text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.9] px-2 md:px-4 ${step === 'SHOCK_ADVISED' || step === 'SHOCKING' ? 'text-orange-500' : 'text-white'}`}>
                                        {steps[step]?.message || ''}
                                    </h3>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls Section */}
                    <div className="h-[180px] md:h-[280px] px-8 md:px-16 flex items-center justify-between gap-4 md:gap-12 bg-slate-700/30">
                        {/* Power Button */}
                        <div className="flex flex-col items-center gap-2 md:gap-4">
                            <button onClick={handlePower} className={`w-16 h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl border-b-[6px] md:border-b-[10px] ${step === 'OFF' ? 'bg-slate-800 border-slate-950 text-slate-600' : 'bg-green-600 border-green-900 text-white shadow-green-500/30'}`}>
                                <Power size={24} className={step !== 'OFF' ? 'animate-pulse' : ''} />
                            </button>
                            <span className="text-[8px] md:text-[11px] uppercase font-black text-slate-500 tracking-widest leading-none">Power</span>
                        </div>

                        {/* Shock Button */}
                        <div className="flex flex-col items-center gap-2 md:gap-4">
                            <button
                                onClick={deliverShock}
                                disabled={step !== 'SHOCKING'}
                                className={`w-20 h-20 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all shadow-2xl relative overflow-hidden active:scale-95 ${step === 'SHOCKING' ? 'bg-orange-500 border-b-[8px] md:border-b-[14px] border-orange-900 animate-flash cursor-pointer' : 'bg-slate-300/10 border-b-[8px] md:border-b-[14px] border-slate-950 opacity-10 cursor-not-allowed'}`}
                            >
                                <Zap size={32} className="md:size-[64px] text-white relative z-10" />
                                {step === 'SHOCKING' && <div className="absolute inset-0 bg-white/30 animate-pulse"></div>}
                            </button>
                            <span className={`text-[9px] md:text-[12px] uppercase font-black tracking-[0.1em] md:tracking-[0.2em] leading-none ${step === 'SHOCKING' ? 'text-orange-500 animate-pulse' : 'text-slate-500'}`}>Shock</span>
                        </div>

                        {/* CPR/Interaction Button */}
                        <div className="flex flex-col items-center gap-2 md:gap-4">
                            <button
                                onClick={cprPhase === 'compressing' ? handleCpr : handleBreath}
                                disabled={step !== 'CPR'}
                                className={`w-16 h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-2xl border-b-[6px] md:border-b-[10px] ${step === 'CPR' ? (cprPhase === 'compressing' ? 'bg-brand-600 border-brand-900' : 'bg-pink-600 border-pink-900') : 'bg-slate-300/10 border-b-[6px] md:border-b-[10px] border-slate-950 opacity-10'}`}
                            >
                                <Activity size={24} className="md:size-[48px] text-white" />
                            </button>
                            <span className="text-[8px] md:text-[11px] uppercase font-black text-slate-500 tracking-widest leading-none">{cprPhase === 'compressing' ? 'Comp' : 'Breath'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes flash {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 60px 20px rgba(249, 115, 22, 0.7); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
                }
                .animate-flash { animation: flash 1s infinite; }
                .pad-grid { background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 8px 8px; }
                @keyframes ping-slow {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
                }
                .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
            `}</style>
        </div>
    );
};

// Internal Sub-components
const PadTarget = ({ onClick, className, label }) => (
    <button
        onClick={onClick}
        className={`absolute z-30 bg-blue-500/10 border-4 border-dashed border-blue-400/50 rounded-[35px] animate-pulse hover:bg-blue-500/30 transition-all flex flex-col items-center justify-center p-4 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.2)] ${className}`}
    >
        <Activity size={24} className="mb-2" />
        <span className="text-[10px] font-black uppercase text-center leading-tight">{label}</span>
    </button>
);

const RealisticPad = ({ id }) => (
    <div className="w-full h-full bg-slate-100 rounded-[35px] shadow-2xl border-b-[10px] border-slate-300 relative overflow-hidden flex flex-col items-center justify-center p-4 group">
        <div className="absolute inset-0 pad-grid opacity-20"></div>
        <div className="w-full h-1/2 border-2 border-slate-200 rounded-2xl mb-2 flex flex-col items-center p-2">
            <div className="w-8 h-12 border-2 border-slate-300 rounded-md bg-slate-50 relative">
                <div className="absolute top-2 left-1 right-1 h-1 bg-red-400 rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-800"></div>
            </div>
        </div>
        <span className="text-[10px] font-black text-slate-400/60 uppercase">Electrode {id}</span>
        {/* Wire attachment point */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-200 rounded-full border-4 border-slate-300"></div>
    </div>
);

export default DesaSimulator;
