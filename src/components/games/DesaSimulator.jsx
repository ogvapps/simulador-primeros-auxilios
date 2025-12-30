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

const DesaSimulator = ({ onComplete, onBack, playSound, t }) => {
    const [step, setStep] = useState('OFF'); // OFF, POWERING_ON, PLACE_PADS, ANALYZING, SHOCK_ADVISED, SHOCKING, SHOCK_DELIVERED, CPR
    const [pads, setPads] = useState({ top: false, bottom: false });
    const [muted, setMuted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [cprCount, setCprCount] = useState(0);
    const audioRef = useRef(null);

    // Simulation steps configuration
    const steps = {
        'OFF': {
            message: 'Pulse el botón de encendido para comenzar',
            instruction: 'Encender el DESA es el primer paso vital.',
            color: 'bg-slate-800'
        },
        'POWERING_ON': {
            message: 'Iniciando sistema...',
            instruction: 'Escuche atentamente las instrucciones de voz.',
            color: 'bg-brand-600'
        },
        'PLACE_PADS': {
            message: 'Conecte los electrodos en el tórax desnudo del paciente',
            instruction: 'Coloque un parche en el hombro derecho y otro en el costado izquierdo.',
            color: 'bg-blue-600'
        },
        'ANALYZING': {
            message: 'Analizando ritmo cardíaco. No toque al paciente.',
            instruction: 'Asegúrese de que nadie esté tocando a la víctima.',
            color: 'bg-yellow-500'
        },
        'SHOCK_ADVISED': {
            message: 'Descarga recomendada. Manténgase alejado.',
            instruction: 'El equipo se está cargando. Grite: "¡FUERA TODOS!".',
            color: 'bg-orange-600'
        },
        'SHOCKING': {
            message: 'Pulse el botón de descarga AHORA',
            instruction: 'Presione el botón parpadeante inmediatamente.',
            color: 'bg-red-600'
        },
        'SHOCK_DELIVERED': {
            message: 'Descarga realizada. Comience RCP.',
            instruction: '30 compresiones y 2 insuflaciones.',
            color: 'bg-green-600'
        },
        'CPR': {
            message: 'Realice compresiones al ritmo del metrónomo',
            instruction: 'Mantenga un ritmo de 100-120 por minuto.',
            color: 'bg-brand-500'
        }
    };

    // Step transitions
    const handlePower = () => {
        if (step === 'OFF') {
            setStep('POWERING_ON');
            if (!muted) try { playSound('success'); } catch (e) { }
            setTimeout(() => setStep('PLACE_PADS'), 2000);
        } else {
            setStep('OFF');
            setPads({ top: false, bottom: false });
            setCprCount(0);
        }
    };

    const placePad = (position) => {
        if (step !== 'PLACE_PADS') return;

        const newPads = { ...pads, [position]: true };
        setPads(newPads);

        if (!muted) try { playSound('click'); } catch (e) { }

        if (newPads.top && newPads.bottom) {
            setTimeout(() => setStep('ANALYZING'), 1500);
        }
    };

    useEffect(() => {
        if (step === 'ANALYZING') {
            const timeout = setTimeout(() => {
                setStep('SHOCK_ADVISED');
                if (!muted) try { playSound('alarm'); } catch (e) { }
            }, 4000);
            return () => clearTimeout(timeout);
        }

        if (step === 'SHOCK_ADVISED') {
            const timeout = setTimeout(() => {
                setStep('SHOCKING');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [step, muted]);

    const deliverShock = () => {
        if (step !== 'SHOCKING') return;
        setStep('SHOCK_DELIVERED');
        if (!muted) try { playSound('powerup'); } catch (e) { }

        // Visual Zap effect
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white z-[100] animate-pulse pointer-events-none opacity-50';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 500);

        setTimeout(() => setStep('CPR'), 2000);
    };

    const handleCpr = () => {
        if (step !== 'CPR') return;
        setCprCount(prev => {
            const next = prev + 1;
            if (next === 30) {
                confetti();
                if (!muted) try { playSound('fanfare'); } catch (e) { }
                setTimeout(() => onComplete && onComplete(), 2000);
            }
            return next;
        });
        if (!muted) try { playSound('success'); } catch (e) { }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden font-sans">
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between p-6 bg-slate-800/50 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
                        <Activity className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight leading-none">SIMULADOR DESA</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">LifeSupport v2.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMuted(!muted)}
                        className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <button
                        onClick={onBack}
                        className="p-3 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Container */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden">

                {/* Left Side: Torso/Patient */}
                <div className="flex-[1.5] bg-slate-800/30 rounded-3xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                    {/* Pulsing Aura if Analyzing */}
                    {step === 'ANALYZING' && (
                        <div className="absolute inset-0 bg-yellow-400/5 animate-pulse"></div>
                    )}
                    {step === 'SHOCKING' && (
                        <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
                    )}

                    {/* Torso Illustration */}
                    <div className="relative w-72 h-96 md:w-96 md:h-[500px] flex items-center justify-center">
                        <User
                            size={400}
                            strokeWidth={0.5}
                            className={`text-slate-700 transition-all duration-700 ${step !== 'OFF' ? 'text-slate-600' : ''}`}
                        />

                        {/* Target Zones */}
                        {step === 'PLACE_PADS' && (
                            <>
                                {!pads.top && (
                                    <button
                                        onClick={() => placePad('top')}
                                        className="absolute top-[20%] right-[15%] w-24 h-32 bg-brand-500/20 border-4 border-dashed border-brand-400 rounded-2xl animate-pulse flex flex-col items-center justify-center text-brand-400 font-bold text-[10px] text-center p-2 hover:bg-brand-500/40 transition-all"
                                    >
                                        <Info size={20} className="mb-1" />
                                        Electrodo Superior Derecho
                                    </button>
                                )}
                                {!pads.bottom && (
                                    <button
                                        onClick={() => placePad('bottom')}
                                        className="absolute bottom-[25%] left-[10%] w-24 h-32 bg-brand-500/20 border-4 border-dashed border-brand-400 rounded-2xl animate-pulse flex flex-col items-center justify-center text-brand-400 font-bold text-[10px] text-center p-2 hover:bg-brand-500/40 transition-all"
                                    >
                                        <Info size={20} className="mb-1" />
                                        Electrodo Lateral Izquierdo
                                    </button>
                                )}
                            </>
                        )}

                        {/* Placed Pads */}
                        {pads.top && (
                            <div className="absolute top-[20%] right-[15%] w-24 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-b-8 border-slate-300 animate-in zoom-in rotate-6">
                                <div className="text-slate-800 flex flex-col items-center">
                                    <Zap size={24} className="text-slate-400" />
                                    <span className="text-[8px] font-black uppercase mt-2">PAD 01</span>
                                    <div className="w-4 h-4 bg-slate-200 rounded-full mt-2"></div>
                                </div>
                            </div>
                        )}
                        {pads.bottom && (
                            <div className="absolute bottom-[25%] left-[10%] w-24 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-b-8 border-slate-300 animate-in zoom-in -rotate-3">
                                <div className="text-slate-800 flex flex-col items-center">
                                    <Zap size={24} className="text-slate-400" />
                                    <span className="text-[8px] font-black uppercase mt-2">PAD 02</span>
                                    <div className="w-4 h-4 bg-slate-200 rounded-full mt-2"></div>
                                </div>
                            </div>
                        )}

                        {/* Connection Wires (Simplified) */}
                        {step !== 'OFF' && (
                            <div className="absolute bottom-[-20px] left-1/2 w-1 h-32 bg-slate-600 pointer-events-none transform -translate-x-1/2 opacity-30"></div>
                        )}
                    </div>

                    {/* Feedback Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${steps[step].color} shadow-lg`}>
                            {step === 'ANALYZING' ? <RefreshCw className="animate-spin" /> :
                                step === 'SHOCKING' ? <Zap className="animate-bounce" /> : <Info />}
                        </div>
                        <p className="font-bold text-sm md:text-base">{steps[step].instruction}</p>
                    </div>
                </div>

                {/* Right Side: DESA Interface */}
                <div className="flex-1 bg-slate-800 rounded-[40px] border-4 border-slate-700 shadow-2xl relative flex flex-col overflow-hidden">
                    {/* Device Logo/Text */}
                    <div className="text-center py-4 bg-slate-700/50">
                        <span className="text-red-500 font-black italic tracking-tighter text-xl">X-SAVER <span className="text-white not-italic font-medium text-sm">PRO</span></span>
                    </div>

                    {/* Screen Area */}
                    <div className="flex-1 m-4 rounded-[30px] bg-black border-[12px] border-slate-900 shadow-inner relative flex flex-col p-6 overflow-hidden">
                        {/* Screen Content */}
                        {step === 'OFF' ? (
                            <div className="h-full flex items-center justify-center opacity-20">
                                <div className="w-32 h-32 bg-slate-600 rounded-full blur-3xl"></div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col animate-in fade-in duration-1000">
                                {/* LCD Screen Header */}
                                <div className="flex items-center justify-between mb-8 opacity-60">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <div className="text-[10px] font-mono">BATT 98%</div>
                                </div>

                                {/* Main Message Area */}
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                    {step === 'ANALYZING' && (
                                        <div className="mb-6 flex gap-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-3 h-12 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                                            ))}
                                        </div>
                                    )}
                                    {step === 'SHOCK_ADVISED' && (
                                        <AlertTriangle size={64} className="text-orange-500 mb-6 animate-bounce" />
                                    )}
                                    {step === 'SHOCKING' && (
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-red-600 blur-2xl opacity-50 animate-pulse"></div>
                                            <Zap size={80} className="text-red-600 relative z-10 animate-bounce" />
                                        </div>
                                    )}
                                    {step === 'CPR' && (
                                        <div className="mb-6">
                                            <div className="text-6xl font-black text-brand-400 mb-2">{30 - cprCount}</div>
                                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-300">Compresiones Restantes</div>
                                        </div>
                                    )}
                                    {step === 'SHOCK_DELIVERED' && (
                                        <CheckCircle2 size={64} className="text-green-500 mb-6 animate-in zoom-in" />
                                    )}

                                    <h3 className={`text-2xl md:text-3xl font-black leading-tight uppercase tracking-tighter ${step === 'SHOCK_ADVISED' || step === 'SHOCKING' ? 'text-orange-500' : 'text-white'
                                        }`}>
                                        {steps[step].message}
                                    </h3>
                                </div>
                            </div>
                        )}

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="h-48 px-10 flex items-center justify-around gap-8">
                        {/* Power Button */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={handlePower}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-b-4 ${step === 'OFF'
                                    ? 'bg-slate-700 border-slate-900 group-hover:bg-slate-600'
                                    : 'bg-green-600 border-green-800 text-white shadow-green-500/20'
                                    }`}
                            >
                                <Power size={32} className={step === 'OFF' ? 'text-slate-400' : 'text-white animate-pulse'} />
                            </button>
                            <span className="text-[10px] font-black uppercase text-slate-500">Power</span>
                        </div>

                        {/* SHOCK Button */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={deliverShock}
                                disabled={step !== 'SHOCKING'}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl relative overflow-hidden active:scale-90 ${step === 'SHOCKING'
                                    ? 'bg-red-600 border-b-8 border-red-800 animate-flash cursor-pointer'
                                    : 'bg-slate-700 border-b-8 border-slate-900 opacity-40 cursor-not-allowed'
                                    }`}
                            >
                                {step === 'SHOCKING' && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                )}
                                <Zap size={40} className={step === 'SHOCKING' ? 'text-white' : 'text-slate-500'} />
                            </button>
                            <span className={`text-[10px] font-black uppercase ${step === 'SHOCKING' ? 'text-red-500' : 'text-slate-500'}`}>Shock</span>
                        </div>

                        {/* CPR/Metronome Button */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={handleCpr}
                                disabled={step !== 'CPR'}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-b-4 ${step === 'CPR'
                                    ? 'bg-brand-600 border-brand-800 animate-pulse'
                                    : 'bg-slate-700 border-slate-900 opacity-40'
                                    }`}
                            >
                                <Activity size={32} className={step === 'CPR' ? 'text-white' : 'text-slate-500'} />
                            </button>
                            <span className="text-[10px] font-black uppercase text-slate-500">CPR {cprCount > 0 && `(${cprCount})`}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes flash {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 40px 10px rgba(239, 68, 68, 0.6); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                }
                .animate-flash {
                    animation: flash 1s infinite;
                }
            `}</style>
        </div>
    );
};

export default DesaSimulator;


