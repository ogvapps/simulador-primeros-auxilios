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
    RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DesaSimulator = ({ onComplete, onBack, playSound, t, lang }) => {
    const [step, setStep] = useState('OFF'); // OFF, POWERING_ON, PLACE_PADS, ANALYZING, SHOCK_ADVISED, SHOCKING, SHOCK_DELIVERED, CPR
    const [patientMode, setPatientMode] = useState('adult'); // adult, pediatric
    const [pads, setPads] = useState({ top: false, bottom: false });
    const [muted, setMuted] = useState(false);
    const [cprCount, setCprCount] = useState(0);
    const [breathCount, setBreathCount] = useState(0);
    const [cprPhase, setCprPhase] = useState('compressing'); // compressing, breathing
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef(window.speechSynthesis);

    // Voice Engine
    const speak = (text) => {
        if (muted || !text) return;
        if (synthRef.current) synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
        utterance.rate = 1.1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        if (synthRef.current) synthRef.current.speak(utterance);
    };

    // Simulation steps configuration
    const steps = {
        'OFF': {
            message: t?.desa?.steps?.off || 'Pulse el botón de encendido',
            instruction: t?.desa?.instructions?.off || 'Encender el DESA es el primer paso vital.',
            color: 'bg-slate-800'
        },
        'POWERING_ON': {
            message: t?.desa?.steps?.powerOn || 'Iniciando sistema...',
            instruction: t?.desa?.instructions?.powerOn || 'Escuche atentamente las instrucciones.',
            color: 'bg-brand-600'
        },
        'PLACE_PADS': {
            message: patientMode === 'adult'
                ? (t?.desa?.steps?.padsAdult || 'Conecte los electrodos en el tórax desnudo')
                : (t?.desa?.steps?.padsPedia || 'Conecte los electrodos PEDIÁTRICOS (Pecho y Espalda)'),
            instruction: patientMode === 'adult'
                ? (t?.desa?.instructions?.padsAdult || 'Coloque un parche en hombro derecho y otro en costado izquierdo.')
                : (t?.desa?.instructions?.padsPedia || 'Coloque un parche en el centro del pecho y otro en la espalda.'),
            color: 'bg-blue-600'
        },
        'ANALYZING': {
            message: t?.desa?.steps?.analyzing || 'Analizando ritmo. No toque al paciente.',
            instruction: t?.desa?.instructions?.analyzing || 'Mantenga las manos alejadas de la víctima.',
            color: 'bg-yellow-500'
        },
        'SHOCK_ADVISED': {
            message: t?.desa?.steps?.shockAdvised || 'Descarga recomendada. Manténgase alejado.',
            instruction: t?.desa?.instructions?.shockAdvised || 'Grite: "¡FUERA TODOS!". El equipo se está cargando.',
            color: 'bg-orange-600'
        },
        'SHOCKING': {
            message: t?.desa?.steps?.shocking || 'Pulse el botón de descarga AHORA',
            instruction: t?.desa?.instructions?.shocking || 'Presione el botón parpadeante inmediatamente.',
            color: 'bg-red-600'
        },
        'SHOCK_DELIVERED': {
            message: t?.desa?.steps?.shockDelivered || 'Descarga realizada. Inicie RCP.',
            instruction: t?.desa?.instructions?.shockDelivered || 'Realice 30 compresiones y 2 insuflaciones.',
            color: 'bg-green-600'
        },
        'CPR': {
            message: cprPhase === 'compressing'
                ? `${30 - cprCount} Compresiones`
                : `${2 - breathCount} Insuflaciones`,
            instruction: cprPhase === 'compressing'
                ? 'Presione con fuerza en el centro del pecho.'
                : 'Incline la cabeza, tape la nariz y expire aire.',
            color: 'bg-brand-500'
        }
    };

    // Trigger voice on step change
    useEffect(() => {
        if (step === 'CPR') {
            if (cprPhase === 'compressing') {
                speak("Inicie treinta compresiones torácicas.");
            } else {
                speak("Realice dos insuflaciones.");
            }
        } else if (step !== 'OFF') {
            speak(steps[step].message);
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
            if (synthRef.current) synthRef.current.cancel();
        }
    };

    const placePad = (position) => {
        if (step !== 'PLACE_PADS') return;
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
        if (step === 'ANALYZING') {
            const timeout = setTimeout(() => {
                setStep('SHOCK_ADVISED');
                if (!muted) try { playSound('alarm'); } catch (e) { }
            }, 6000);
            return () => clearTimeout(timeout);
        }
        if (step === 'SHOCK_ADVISED') {
            setTimeout(() => setStep('SHOCKING'), 3000);
        }
    }, [step]);

    const deliverShock = () => {
        if (step !== 'SHOCKING') return;
        setStep('SHOCK_DELIVERED');
        if (!muted) try { playSound('powerup'); } catch (e) { }
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white z-[100] animate-pulse pointer-events-none opacity-50';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 500);
        setTimeout(() => setStep('CPR'), 2000);
    };

    const handleCpr = () => {
        if (step !== 'CPR' || cprPhase !== 'compressing') return;
        setCprCount(prev => {
            const next = prev + 1;
            if (next >= 30) {
                setCprPhase('breathing');
                return 0;
            }
            return next;
        });
        if (!muted) try { playSound('success'); } catch (e) { }
    };

    const handleBreath = () => {
        if (step !== 'CPR' || cprPhase !== 'breathing') return;
        setBreathCount(prev => {
            const next = prev + 1;
            if (next >= 2) {
                confetti();
                if (!muted) try { playSound('fanfare'); } catch (e) { }
                speak("Ciclo completado. Muy bien.");
                setTimeout(() => onComplete && onComplete(), 2000);
                return 0;
            }
            return next;
        });
        if (!muted) try { playSound('powerup'); } catch (e) { }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden font-sans">
            <div className="flex items-center justify-between p-6 bg-slate-900 shadow-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/50">
                        <Activity className="text-white" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight leading-none uppercase">DESA <span className="text-red-500">PRO</span></h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">v3.0 Clinical Edition</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {step === 'OFF' && (
                        <div className="flex bg-slate-800 p-1 rounded-xl">
                            <button onClick={() => setPatientMode('adult')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${patientMode === 'adult' ? 'bg-white text-slate-950 shadow-md' : 'text-slate-500'}`}>ADULTO</button>
                            <button onClick={() => setPatientMode('pediatric')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${patientMode === 'pediatric' ? 'bg-yellow-500 text-slate-950 shadow-md' : 'text-slate-500'}`}>NIÑO</button>
                        </div>
                    )}
                    <button onClick={() => { setMuted(!muted); if (!muted) synthRef.current.cancel(); }} className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all">
                        {muted ? <VolumeX size={24} /> : <Volume2 size={24} className={isSpeaking ? 'animate-pulse text-brand-400' : ''} />}
                    </button>
                    <button onClick={onBack} className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden">
                <div className="flex-[1.5] bg-slate-900/50 rounded-[48px] border border-white/5 relative flex items-center justify-center">

                    {/* Improved Torso with Anatomical Guides */}
                    <div className={`relative transition-all duration-1000 ${patientMode === 'adult' ? 'w-80 h-[500px]' : 'w-56 h-[350px]'}`}>
                        {/* Body Contour Drawing */}
                        <div className="absolute inset-0 bg-slate-800/20 rounded-[100px] border-4 border-slate-700/50">
                            {/* Visual Guides */}
                            <div className="absolute top-[35%] left-[25%] w-3 h-3 bg-slate-700/40 rounded-full"></div> {/* Nipple L */}
                            <div className="absolute top-[35%] right-[25%] w-3 h-3 bg-slate-700/40 rounded-full"></div> {/* Nipple R */}
                            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-4 bg-slate-700/20 h-[50%] rounded-full"></div> {/* Sternum */}
                        </div>

                        <User size={patientMode === 'adult' ? 420 : 320} strokeWidth={0.5} className={`transition-all duration-700 ${step !== 'OFF' ? 'text-slate-600' : 'text-slate-800'} relative z-10`} />

                        {/* Interactive Zones */}
                        {step === 'PLACE_PADS' && (
                            <>
                                {!pads.top && (
                                    <button onClick={() => placePad('top')} className={`absolute z-30 bg-blue-500/10 border-4 border-dashed border-blue-400 rounded-3xl animate-pulse hover:bg-blue-500/30 transition-all flex flex-col items-center justify-center p-4 text-blue-300 font-bold ${patientMode === 'adult' ? 'top-[18%] right-[10%] w-24 h-32' : 'top-[35%] left-1/2 -translate-x-1/2 w-20 h-24'}`}>
                                        <div className="text-[10px] uppercase mb-1">Colocar</div>
                                        <Zap size={20} />
                                    </button>
                                )}
                                {!pads.bottom && (
                                    <button onClick={() => placePad('bottom')} className={`absolute z-30 bg-blue-500/10 border-4 border-dashed border-blue-400 rounded-3xl animate-pulse hover:bg-blue-500/30 transition-all flex flex-col items-center justify-center p-4 text-blue-300 font-bold ${patientMode === 'adult' ? 'bottom-[25%] left-[8%] w-24 h-32' : 'bottom-[-10%] left-1/2 -translate-x-1/2 w-20 h-24 opacity-60'}`}>
                                        <RefreshCw size={20} />
                                        <div className="text-[8px] mt-1 text-center">Girar Patient para Espalda</div>
                                    </button>
                                )}
                            </>
                        )}

                        {/* Visual Electrodes with internal drawings */}
                        {pads.top && (
                            <div className={`absolute z-20 bg-white rounded-3xl shadow-2xl border-b-8 border-slate-300 animate-in zoom-in ${patientMode === 'adult' ? 'top-[18%] right-[10%] w-24 h-32 rotate-6' : 'top-[35%] left-1/2 -translate-x-1/2 w-20 h-24'}`}>
                                <div className="flex flex-col items-center justify-center h-full p-2">
                                    <div className="w-10 h-14 border border-slate-200 rounded-lg flex flex-col items-center p-1">
                                        <div className="w-6 h-1 bg-red-200 rounded-full mb-1"></div>
                                        <div className="w-4 h-4 bg-slate-800 rounded-full mt-auto"></div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 mt-1 uppercase">Electrodo 01</span>
                                </div>
                            </div>
                        )}
                        {pads.bottom && (
                            <div className={`absolute z-20 bg-white rounded-3xl shadow-2xl border-b-8 border-slate-300 animate-in zoom-in ${patientMode === 'adult' ? 'bottom-[25%] left-[8%] w-24 h-32 -rotate-3' : 'bottom-[-5%] left-1/2 -translate-x-1/2 w-20 h-24'}`}>
                                <div className="flex flex-col items-center justify-center h-full p-2">
                                    <div className="w-10 h-14 border border-slate-200 rounded-lg flex flex-col items-center p-1">
                                        <div className="w-6 h-1 bg-red-200 rounded-full mb-1"></div>
                                        <div className="w-4 h-4 bg-slate-800 rounded-full mt-auto"></div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 mt-1 uppercase">Electrodo 02</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-black/70 backdrop-blur-xl p-6 rounded-[32px] border border-white/5 flex items-center gap-6 shadow-2xl">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${steps[step].color} shadow-lg`}>
                            {step === 'ANALYZING' ? <RefreshCw className="animate-spin" /> : step === 'SHOCKING' ? <Zap className="animate-bounce" /> : <Info />}
                        </div>
                        <p className="text-xl font-bold leading-tight">{steps[step].instruction}</p>
                    </div>
                </div>

                <div className="flex-1 bg-slate-800 rounded-[64px] border-8 border-slate-700 shadow-2xl relative flex flex-col overflow-hidden">
                    <div className="text-center py-4 bg-slate-700/50">
                        <span className="text-white font-black italic tracking-tighter text-xl uppercase">DESA <span className="text-red-500">PRO-TECH</span></span>
                    </div>

                    <div className="flex-1 m-6 rounded-[48px] bg-black border-[14px] border-slate-900 shadow-inner relative flex flex-col p-8 overflow-hidden">
                        {step === 'OFF' ? (
                            <div className="h-full flex items-center justify-center opacity-30">
                                <Power size={64} className="text-slate-800" />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col animate-in fade-in duration-1000">
                                <div className="flex items-center justify-between mb-8 opacity-60">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <div className="text-xs font-mono">{patientMode === 'pediatric' ? 'PEDIATRIC MODE' : 'ADULT MODE'}</div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                    {step === 'ANALYZING' && (
                                        <div className="mb-10 flex gap-4 h-12 items-end">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="w-4 bg-yellow-500 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 150}ms` }}></div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 'SHOCK_ADVISED' && <AlertTriangle size={80} className="text-orange-500 mb-8 animate-bounce" />}
                                    {step === 'SHOCKING' && <Zap size={100} className="text-red-500 mb-8 animate-flash drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />}

                                    {step === 'CPR' && (
                                        <div className="mb-8">
                                            <div className="text-[100px] font-black text-brand-400 leading-none mb-2 tabular-nums">
                                                {cprPhase === 'compressing' ? 30 - cprCount : 2 - breathCount}
                                            </div>
                                            <div className="text-[12px] uppercase tracking-[0.4em] font-bold text-brand-200">
                                                {cprPhase === 'compressing' ? 'Compresiones' : 'Insuflaciones'}
                                            </div>
                                        </div>
                                    )}

                                    <h3 className={`text-2xl lg:text-3xl font-black leading-tight uppercase tracking-tight ${step === 'SHOCK_ADVISED' || step === 'SHOCKING' ? 'text-orange-500' : 'text-white'}`}>
                                        {steps[step].message}
                                    </h3>
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-20"></div>
                    </div>

                    <div className="h-56 px-12 flex items-center justify-around gap-10">
                        <div className="flex flex-col items-center gap-3">
                            <button onClick={handlePower} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-b-4 ${step === 'OFF' ? 'bg-slate-700 border-slate-900' : 'bg-green-600 border-green-800 shadow-green-500/20'}`}>
                                <Power size={36} className={step === 'OFF' ? 'text-slate-500' : 'text-white animate-pulse'} />
                            </button>
                            <span className="text-[10px] uppercase font-black text-slate-500">Power</span>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <button onClick={deliverShock} disabled={step !== 'SHOCKING'} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl relative overflow-hidden active:scale-90 ${step === 'SHOCKING' ? 'bg-orange-500 border-b-8 border-orange-800 animate-flash cursor-pointer' : 'bg-slate-700 border-b-8 border-slate-950 opacity-10 cursor-not-allowed'}`}>
                                <Zap size={48} className="text-white relative z-10" />
                                {step === 'SHOCKING' && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                            </button>
                            <span className={`text-[10px] uppercase font-black ${step === 'SHOCKING' ? 'text-orange-500' : 'text-slate-500'}`}>Shock</span>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <button onClick={cprPhase === 'compressing' ? handleCpr : handleBreath} disabled={step !== 'CPR'} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-b-4 ${step === 'CPR' ? (cprPhase === 'compressing' ? 'bg-brand-600 border-brand-800' : 'bg-pink-600 border-pink-800 shadow-pink-500/20') : 'bg-slate-700 border-slate-900 opacity-10'}`}>
                                <Activity size={36} className="text-white" />
                            </button>
                            <span className="text-[10px] uppercase font-black text-slate-500">{cprPhase === 'compressing' ? 'Comp.' : 'Aire'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes flash {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 40px 10px rgba(249, 115, 22, 0.6); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
                }
                .animate-flash { animation: flash 1s infinite; }
            `}</style>
        </div>
    );
};



