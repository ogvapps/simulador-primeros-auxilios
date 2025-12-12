import React, { useState, useEffect, useRef } from 'react';
import { Swords, Clock, Trophy, XCircle, CheckCircle2, Copy, Users, Loader2 } from 'lucide-react';
import { ref, set, onValue, update, serverTimestamp, runTransaction } from 'firebase/database';
import { rtdb, isMock } from '../../firebaseConfig';
import { Button, Card, Badge, Input } from '../DesignSystem';
import { EXAM_QUESTIONS, XP_REWARDS } from '../../constants';
import { playSound } from '../../utils';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const DuelGame = ({ onBack }: { onBack: () => void }) => {
    const { profile, updateProgress } = useGame();
    const { t } = useLanguage();
    const [roomId, setRoomId] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [gameState, setGameState] = useState<any>(null);
    const [view, setView] = useState<'menu' | 'lobby' | 'game' | 'result'>('menu');
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [playerRole, setPlayerRole] = useState<'p1' | 'p2' | null>(null);

    // Sync Game State
    useEffect(() => {
        if (!roomId || isMock) return;
        const gameRef = ref(rtdb, `duels/${roomId}`);
        const unsub = onValue(gameRef, (snap) => {
            const val = snap.val();
            if (val) {
                setGameState(val);
                if (val.status === 'playing') setView('game');
                if (val.status === 'finished') setView('result');
            }
        });
        return () => unsub();
    }, [roomId]);

    // Timer Logic
    useEffect(() => {
        if (view === 'game' && gameState?.status === 'playing') {
            const timer = setInterval(() => {
                const now = Date.now();
                const start = gameState.roundStart || now;
                const elapsed = Math.floor((now - start) / 1000);
                const remaining = Math.max(0, 15 - elapsed); // 15 seconds per question
                setTimeLeft(remaining);
                
                // Host handles timeout
                if (remaining === 0 && playerRole === 'p1') {
                    handleRoundEnd(null);
                }
            }, 500);
            return () => clearInterval(timer);
        }
    }, [view, gameState, playerRole]);

    const createDuel = async () => {
        if (isMock) { alert("Multijugador no disponible en demo."); return; }
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const initData = {
            status: 'waiting',
            round: 1,
            p1: { name: profile?.name || 'P1', score: 0 },
            p2: null,
            qIndex: Math.floor(Math.random() * EXAM_QUESTIONS.length)
        };
        await set(ref(rtdb, `duels/${code}`), initData);
        setRoomId(code);
        setPlayerRole('p1');
        setView('lobby');
    };

    const joinDuel = async () => {
        if (isMock) { alert("Multijugador no disponible en demo."); return; }
        if (joinCode.length !== 5) return;
        const duelRef = ref(rtdb, `duels/${joinCode}`);
        
        await update(duelRef, {
            p2: { name: profile?.name || 'P2', score: 0 },
            status: 'ready'
        });
        setRoomId(joinCode);
        setPlayerRole('p2');
        setView('lobby');
    };

    const startDuel = () => {
        update(ref(rtdb, `duels/${roomId}`), {
            status: 'playing',
            roundStart: serverTimestamp()
        });
    };

    const handleAnswer = (optIndex: number) => {
        if (selectedOpt !== null) return; // Already answered
        setSelectedOpt(optIndex);
        
        const currentQ = EXAM_QUESTIONS[gameState.qIndex];
        const isCorrect = currentQ.opts[optIndex] === currentQ.a;

        if (isCorrect) {
            handleRoundEnd(playerRole);
        } else {
            playSound('error');
            // Wrong answer doesn't end round immediately, just locks player
            // But for simplicity in this MVP, we can treat it as round end if P2 also failed or something.
            // Simplified: If you miss, you wait. If opponent hits, they win.
        }
    };

    const handleRoundEnd = (winner: 'p1' | 'p2' | null) => {
        // Transaction to ensure only first correct answer wins
        runTransaction(ref(rtdb, `duels/${roomId}`), (currentData) => {
            if (currentData && currentData.roundWinner) return; // Already claimed
            
            if (currentData) {
                if (winner) {
                    currentData[winner].score += 1;
                    currentData.roundWinner = winner;
                }
                currentData.round += 1;
                // Next Q
                currentData.qIndex = (currentData.qIndex + 1) % EXAM_QUESTIONS.length;
                currentData.roundStart = Date.now() + 3000; // Delay for next round
                
                if (currentData.round > 5) {
                    currentData.status = 'finished';
                } else {
                    // Reset local states logic would be handled by effects
                }
                return currentData;
            }
        });
    };

    // Reset selection on new round
    useEffect(() => {
        if (gameState?.round) {
            setSelectedOpt(null);
            playSound('click'); // New round sound
        }
    }, [gameState?.round]);

    if (view === 'menu') {
        return (
            <div className="max-w-md mx-auto p-6 space-y-6 animate-in zoom-in">
                <div className="text-center">
                    <Swords size={64} className="mx-auto text-red-600 mb-4" />
                    <h2 className="text-3xl font-black text-gray-800">{t('duelTitle')}</h2>
                    <p className="text-gray-500">{t('duelDesc')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="primary" onClick={createDuel} className="h-32 flex flex-col items-center justify-center">
                        <Trophy size={32} className="mb-2"/> {t('createRoom')}
                    </Button>
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200 flex flex-col justify-center gap-2">
                        <Input 
                            placeholder="12345" 
                            className="text-center text-xl tracking-widest font-mono"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            maxLength={5}
                        />
                        <Button variant="secondary" onClick={joinDuel} disabled={joinCode.length !== 5}>
                            {t('joinRoom')}
                        </Button>
                    </div>
                </div>
                <Button variant="ghost" fullWidth onClick={onBack}>Volver</Button>
            </div>
        );
    }

    if (view === 'lobby') {
        return (
            <div className="max-w-md mx-auto p-8 text-center animate-in fade-in">
                <h2 className="text-2xl font-bold mb-4">{t('roomCode')}</h2>
                <div className="bg-slate-900 text-white text-5xl font-mono p-6 rounded-2xl mb-8 tracking-[0.5em] relative cursor-pointer" onClick={() => navigator.clipboard.writeText(roomId)}>
                    {roomId}
                    <Copy size={16} className="absolute top-2 right-2 text-slate-500" />
                </div>
                
                <div className="flex justify-around mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><Users className="text-blue-600"/></div>
                        <p className="font-bold">{gameState?.p1?.name}</p>
                    </div>
                    <div className="flex items-center text-2xl font-black text-gray-300">VS</div>
                    <div className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${gameState?.p2 ? 'bg-red-100' : 'bg-gray-100 animate-pulse'}`}>
                            <Users className={gameState?.p2 ? 'text-red-600' : 'text-gray-400'}/>
                        </div>
                        <p className="font-bold">{gameState?.p2?.name || t('waitingPlayer')}</p>
                    </div>
                </div>

                {playerRole === 'p1' && gameState?.p2 && (
                    <Button size="xl" fullWidth onClick={startDuel} className="animate-bounce">
                        {t('duelReady')}
                    </Button>
                )}
                {playerRole === 'p2' && (
                    <p className="text-gray-500 animate-pulse">{t('waitingHost')}</p>
                )}
            </div>
        );
    }

    if (view === 'game') {
        const question = EXAM_QUESTIONS[gameState.qIndex || 0];
        
        return (
            <div className="max-w-2xl mx-auto p-4 flex flex-col h-[calc(100vh-100px)]">
                {/* Scoreboard */}
                <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl mb-4 shadow-lg">
                    <div className="text-center">
                        <p className="text-xs text-blue-300">{gameState.p1.name}</p>
                        <p className="text-3xl font-black">{gameState.p1.score}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase font-bold text-gray-500 mb-1">{t('round')} {gameState.round}/5</span>
                        <div className={`text-2xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {timeLeft}s
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-red-300">{gameState.p2.name}</p>
                        <p className="text-3xl font-black">{gameState.p2.score}</p>
                    </div>
                </div>

                {/* Question */}
                <Card className="flex-1 flex flex-col justify-center mb-4 border-b-8 border-blue-600">
                    <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-8">{question.q}</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {question.opts.map((opt: string, i: number) => {
                            const isSelected = selectedOpt === i;
                            let style = "bg-white border-2 border-gray-100 hover:border-blue-500";
                            if (isSelected) {
                                style = opt === question.a ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    disabled={selectedOpt !== null}
                                    className={`p-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${style}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </Card>
            </div>
        );
    }

    if (view === 'result') {
        const iWon = (playerRole === 'p1' && gameState.p1.score > gameState.p2.score) || 
                     (playerRole === 'p2' && gameState.p2.score > gameState.p1.score);
        
        return (
            <div className="max-w-md mx-auto p-8 text-center animate-in zoom-in">
                {iWon ? (
                    <>
                        <Trophy size={80} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                        <h2 className="text-4xl font-black text-gray-800 mb-2">¡VICTORIA!</h2>
                        <p className="text-xl text-gray-600 mb-8">+100 XP</p>
                    </>
                ) : (
                    <>
                        <XCircle size={80} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-4xl font-black text-gray-800 mb-2">DERROTA</h2>
                        <p className="text-xl text-gray-600 mb-8">+20 XP (Participación)</p>
                    </>
                )}
                
                <div className="bg-gray-100 p-4 rounded-xl mb-8 flex justify-center gap-8">
                    <div className="text-center">
                        <p className="font-bold text-gray-500">{gameState.p1.name}</p>
                        <p className="text-3xl font-black">{gameState.p1.score}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-gray-500">{gameState.p2.name}</p>
                        <p className="text-3xl font-black">{gameState.p2.score}</p>
                    </div>
                </div>

                <Button fullWidth variant="primary" onClick={onBack}>Volver al Menú</Button>
            </div>
        );
    }

    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>;
};