import React, { useState, useEffect } from 'react';
import { Users, Eye, Activity, CheckCircle2, XCircle, ArrowRight, RotateCcw, Play, Loader2, Copy } from 'lucide-react';
import { ref, set, onValue, update, serverTimestamp } from 'firebase/database';
import { rtdb, isMock } from '../../firebaseConfig';
import { Button, Card, Badge, Input } from '../DesignSystem';
import { PAIR_SCENARIOS, XP_REWARDS } from '../../constants';
import { playSound } from '../../utils';
import { PairScenario } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export const PairGame = ({ onComplete, onBack }: { onComplete: (xp: number) => void, onBack: () => void }) => {
    const { t } = useLanguage();
    const [scenario, setScenario] = useState<PairScenario | null>(null);
    const [roomId, setRoomId] = useState('');
    const [roomInput, setRoomInput] = useState('');
    const [role, setRole] = useState<'host' | 'guest' | null>(null); // Host is Victim, Guest is Rescuer
    const [gameState, setGameState] = useState<any>(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const [error, setError] = useState('');

    // --- FIREBASE SYNC LOGIC ---

    // Listener for Room Updates
    useEffect(() => {
        if (!roomId || isMock) return;

        const roomRef = ref(rtdb, `rooms/${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameState(data);
                if (data.status === 'playing' && isWaiting) setIsWaiting(false);
            } else {
                // Room deleted or doesn't exist
                if (gameState) setError("La sala ha sido cerrada.");
            }
        });

        return () => unsubscribe();
    }, [roomId, isWaiting]);

    const createRoom = async (selectedScenario: PairScenario) => {
        playSound('click');
        if (isMock) {
            alert("El modo multijugador real no está disponible en modo Demo.");
            return;
        }

        const newRoomId = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit code
        const initialState = {
            scenarioId: selectedScenario.id,
            status: 'waiting',
            stepIndex: 0,
            feedback: null, // { correct: boolean, text: string }
            lastUpdate: serverTimestamp()
        };

        try {
            await set(ref(rtdb, `rooms/${newRoomId}`), initialState);
            setRoomId(newRoomId);
            setScenario(selectedScenario);
            setRole('host'); // Host is usually Victim
            setIsWaiting(true);
        } catch (e) {
            console.error(e);
            setError("Error al crear sala");
        }
    };

    const joinRoom = async () => {
        playSound('click');
        if (isMock) {
            alert("Demo mode.");
            return;
        }
        if (roomInput.length !== 4) return;

        const roomRef = ref(rtdb, `rooms/${roomInput}`);
        
        // We can't use get() in this restrictive snippet easily without async logic in component, 
        // but onValue helps us check existence upon connection in the useEffect.
        // For simplicity, we just set the ID and let the listener handle state.
        
        setRoomId(roomInput);
        setRole('guest'); // Guest is Rescuer
        
        // In a real app, we'd use a transaction to ensure slot availability
        // Here we just update status to playing
        update(roomRef, { status: 'playing' });
    };

    // --- GAME ACTIONS ---

    const submitAction = (isCorrect: boolean, feedbackText: string) => {
        if (!roomId || isMock) return;
        playSound(isCorrect ? 'success' : 'error');
        update(ref(rtdb, `rooms/${roomId}`), {
            feedback: { correct: isCorrect, text: feedbackText }
        });
    };

    const nextPhase = () => {
        if (!roomId || !gameState) return;
        playSound('click');
        update(ref(rtdb, `rooms/${roomId}`), {
            stepIndex: (gameState.stepIndex || 0) + 1,
            feedback: null
        });
    };

    // --- RENDER LOGIC ---

    // 1. SCENARIO SELECTION (Host Only)
    if (!roomId && !role) {
        return (
            <div className="max-w-4xl mx-auto p-4 animate-in fade-in">
                <Button variant="ghost" onClick={onBack} className="mb-4" leftIcon={<ArrowRight className="rotate-180" size={16}/>}>Volver</Button>
                
                <div className="text-center mb-8">
                    <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-pink-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800">{t('pairGameTitle')}</h2>
                    <p className="text-gray-500 mt-2">{t('pairGameDesc')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* CREATE ROOM */}
                    <Card className="border-2 border-pink-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center"><Activity className="mr-2 text-pink-500"/> {t('createRoom')}</h3>
                        <p className="text-sm text-gray-500 mb-4">Elige un escenario y comparte el código.</p>
                        <div className="space-y-3">
                            {PAIR_SCENARIOS.map(s => (
                                <button key={s.id} onClick={() => createRoom(s)} className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-pink-50 hover:text-pink-600 font-bold transition-colors flex items-center">
                                    <span className="bg-white p-2 rounded-full shadow-sm mr-3">{s.icon}</span>
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* JOIN ROOM */}
                    <Card className="border-2 border-blue-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2 text-blue-500"/> {t('joinRoom')}</h3>
                        <p className="text-sm text-gray-500 mb-4">{t('enterCode')}</p>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="0000" 
                                value={roomInput} 
                                onChange={e => setRoomInput(e.target.value)} 
                                maxLength={4} 
                                className="text-center text-2xl tracking-widest font-mono"
                            />
                        </div>
                        <Button fullWidth onClick={joinRoom} disabled={roomInput.length !== 4} className="mt-4" variant="secondary">
                            Unirse
                        </Button>
                    </Card>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        );
    }

    // 2. WAITING ROOM (Host)
    if (role === 'host' && isWaiting) {
        return (
            <div className="max-w-md mx-auto p-8 text-center animate-in zoom-in">
                <h2 className="text-2xl font-bold mb-4">{t('roomCode')}</h2>
                <div className="bg-gray-900 text-white text-5xl font-mono p-6 rounded-xl mb-6 tracking-[1rem] flex justify-center relative cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigator.clipboard.writeText(roomId)}>
                    {roomId}
                    <Copy size={16} className="absolute top-2 right-2 text-gray-500" />
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-500 animate-pulse">
                    <Loader2 className="animate-spin" />
                    {t('waitingPlayer')}
                </div>
                <Button variant="ghost" onClick={() => { setRoomId(''); setRole(null); }} className="mt-8">Cancelar</Button>
            </div>
        );
    }

    // 3. GAMEPLAY
    if (gameState && gameState.status === 'playing') {
        // Hydrate scenario data if guest (since only ID is in DB)
        const currentScenario = scenario || PAIR_SCENARIOS.find(s => s.id === gameState.scenarioId);
        if (!currentScenario) return <div>Error loading scenario</div>;

        const currentStep = currentScenario.steps[gameState.stepIndex];
        const isFinished = !currentStep;

        if (isFinished) {
            return (
                <div className="max-w-md mx-auto p-4 text-center animate-in zoom-in">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">{t('completedTraining')}</h2>
                    <p className="text-gray-600 mb-8">Gran trabajo en equipo.</p>
                    <Button variant="primary" fullWidth onClick={() => onComplete(XP_REWARDS.PAIR_GAME_WIN)}>
                        Recoger Recompensa (+{XP_REWARDS.PAIR_GAME_WIN} XP)
                    </Button>
                </div>
            );
        }

        const isVictim = role === 'host'; // Simplified role assignment
        const feedback = gameState.feedback;

        return (
            <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-100px)] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <Badge variant="purple">Fase {gameState.stepIndex + 1} / {currentScenario.steps.length}</Badge>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isVictim ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                        <span className="text-xs font-bold uppercase">{isVictim ? t('roleVictim') : t('roleRescuer')}</span>
                    </div>
                </div>

                <Card className={`flex-1 flex flex-col justify-center border-t-8 ${isVictim ? 'border-orange-500' : 'border-blue-500'} shadow-xl transition-all`}>
                    
                    {/* VICTIM VIEW */}
                    {isVictim && (
                        <div className="text-center">
                            <h3 className="text-orange-600 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                                <Activity /> {t('victimInstr')}
                            </h3>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8">
                                <p className="text-xl md:text-2xl font-black text-gray-800 leading-snug">
                                    "{currentStep.victimInstruction}"
                                </p>
                            </div>
                            
                            {!feedback ? (
                                <p className="text-gray-400 text-sm animate-pulse">Espera a que tu compañero actúe...</p>
                            ) : (
                                <div className="animate-in zoom-in">
                                    <div className={`p-4 rounded-xl mb-4 ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        <p className="font-bold">{feedback.correct ? t('correct') : t('incorrect')}</p>
                                        <p>{feedback.text}</p>
                                    </div>
                                    {feedback.correct && (
                                        <Button onClick={nextPhase} variant="secondary" rightIcon={<Play size={16}/>}>
                                            {t('nextPhase')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RESCUER VIEW */}
                    {!isVictim && (
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <h3 className="text-blue-600 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Eye /> {t('rescuerView')}
                                </h3>
                                <p className="text-lg font-medium text-gray-700">
                                    {currentStep.rescuerQuestion}
                                </p>
                            </div>

                            {!feedback ? (
                                <div className="space-y-3 mt-auto">
                                    {currentStep.rescuerOptions.map((opt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => submitAction(opt.isCorrect, opt.feedback)}
                                            className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-gray-700"
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-auto text-center animate-in zoom-in">
                                    <div className={`p-6 rounded-xl mb-6 ${feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {feedback.correct ? <CheckCircle2 size={48} className="mx-auto mb-2"/> : <XCircle size={48} className="mx-auto mb-2"/>}
                                        <p className="font-black text-xl">{feedback.correct ? t('correct') : t('incorrect')}</p>
                                        <p className="mt-2 font-medium">{feedback.text}</p>
                                    </div>
                                    {feedback.correct ? (
                                        <p className="text-sm text-gray-400 animate-pulse">{t('waitingHost')}</p>
                                    ) : (
                                        <Button fullWidth onClick={() => submitAction(false, "Reintento...")} variant="secondary" size="lg" leftIcon={<RotateCcw />}>
                                            Reintentar
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </Card>
            </div>
        );
    }

    return <div className="p-8 text-center text-gray-500">Cargando partida...</div>;
};
