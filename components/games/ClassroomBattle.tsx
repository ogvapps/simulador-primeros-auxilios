import React, { useState, useEffect } from 'react';
import { Users, Trophy, Play, CheckCircle2, XCircle, Timer, Monitor, ArrowRight, Loader2, Crown } from 'lucide-react';
import { ref, set, onValue, update, serverTimestamp, runTransaction } from 'firebase/database';
import { rtdb, isMock } from '../../firebaseConfig';
import { Button, Card, Input } from '../DesignSystem';
import { EXAM_QUESTIONS } from '../../constants';
import { playSound } from '../../utils';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';

// --- CONSTANTS ---
const COLORS = [
    'bg-red-500 border-red-700', 
    'bg-blue-500 border-blue-700', 
    'bg-yellow-500 border-yellow-700', 
    'bg-green-500 border-green-700'
];
const ICONS = ['▲', '◆', '●', '■'];

/**
 * HOST COMPONENT (TEACHER)
 */
export const BattleHost = ({ onExit }: { onExit: () => void }) => {
    const { t } = useLanguage();
    const [battleId, setBattleId] = useState('');
    const [gameState, setGameState] = useState<any>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [timer, setTimer] = useState(0);

    // Initial Setup
    useEffect(() => {
        if (isMock) { alert("Modo aula requiere Firebase real."); onExit(); return; }
        
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const battleRef = ref(rtdb, `battles/${code}`);
        
        set(battleRef, {
            status: 'waiting',
            currentQuestion: 0,
            questionStart: 0,
            players: {}
        }).then(() => setBattleId(code));

        const unsub = onValue(battleRef, (snap) => {
            const data = snap.val();
            if (data) {
                setGameState(data);
                if (data.players) {
                    setPlayers(Object.values(data.players));
                }
            }
        });

        return () => {
            unsub();
            // Cleanup could be here, but usually we want results to persist briefly
        };
    }, []);

    // Timer Logic
    useEffect(() => {
        if (gameState?.status === 'playing') {
            const interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - gameState.questionStart) / 1000);
                const remaining = Math.max(0, 20 - elapsed); // 20s per question
                setTimer(remaining);
                if (remaining === 0) {
                    showLeaderboard();
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [gameState?.status, gameState?.questionStart]);

    const startGame = () => {
        playSound('fanfare');
        update(ref(rtdb, `battles/${battleId}`), {
            status: 'playing',
            currentQuestion: 0,
            questionStart: serverTimestamp(),
            answers: null // Clear previous answers
        });
    };

    const nextQuestion = () => {
        const nextIdx = (gameState.currentQuestion || 0) + 1;
        if (nextIdx >= EXAM_QUESTIONS.length) {
            update(ref(rtdb, `battles/${battleId}`), { status: 'finished' });
        } else {
            playSound('click');
            update(ref(rtdb, `battles/${battleId}`), {
                status: 'playing',
                currentQuestion: nextIdx,
                questionStart: serverTimestamp(),
                answers: null
            });
        }
    };

    const showLeaderboard = async () => {
        // Calculate scores transactionally to ensure consistency
        const battleRef = ref(rtdb, `battles/${battleId}`);
        await runTransaction(battleRef, (data) => {
            if (!data || data.status !== 'playing') return; // Prevent double calculation

            const qIdx = data.currentQuestion;
            const currentQ = EXAM_QUESTIONS[qIdx];
            const answers = data.answers || {};
            const startTime = data.questionStart;
            
            // Iterate players and update score
            Object.keys(data.players || {}).forEach(uid => {
                const player = data.players[uid];
                const playerAns = answers[uid]; // { answer: string, timestamp: number }
                
                player.lastCorrect = false; // Reset for feedback view
                
                if (playerAns && playerAns.answer === currentQ.a) {
                    // Score formula: Base 500 + Speed Bonus (up to 500)
                    const timeTaken = (playerAns.timestamp - startTime) / 1000;
                    const speedBonus = Math.max(0, 500 * (1 - timeTaken / 20));
                    const points = Math.round(500 + speedBonus);
                    
                    player.score = (player.score || 0) + points;
                    player.streak = (player.streak || 0) + 1;
                    player.lastCorrect = true;
                } else {
                    player.streak = 0;
                }
            });

            data.status = 'leaderboard';
            return data;
        });
        playSound('success');
    };

    const currentQ = EXAM_QUESTIONS[gameState?.currentQuestion || 0];

    if (!gameState) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-slate-800 p-4 flex justify-between items-center shadow-md">
                <h2 className="font-bold text-xl flex items-center gap-2"><Monitor /> MODO PROFE</h2>
                <div className="bg-indigo-600 px-6 py-2 rounded-xl font-mono text-3xl font-black tracking-widest shadow-lg animate-pulse border-2 border-indigo-400">
                    {battleId}
                </div>
                <Button variant="danger" size="sm" onClick={onExit}>Terminar</Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-6xl p-6 flex flex-col justify-center">
                
                {gameState.status === 'waiting' && (
                    <div className="text-center animate-in zoom-in">
                        <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                            {t('joinBattle')}
                        </h1>
                        <div className="bg-slate-800 p-8 rounded-3xl inline-block shadow-2xl border border-slate-700">
                            <p className="text-slate-400 text-xl mb-4">Código de acceso:</p>
                            <p className="text-8xl font-mono font-black tracking-widest mb-8 text-white">{battleId}</p>
                            <div className="flex items-center justify-center gap-4 text-2xl font-bold text-indigo-400 bg-indigo-900/30 p-4 rounded-xl">
                                <Users size={32} />
                                {players.length} {t('playersJoined')}
                            </div>
                        </div>
                        <div className="mt-12">
                            <Button size="xl" variant="success" onClick={startGame} disabled={players.length === 0} className="text-2xl px-12 py-6 shadow-green-900/50">
                                {t('startBattle')}
                            </Button>
                        </div>
                    </div>
                )}

                {gameState.status === 'playing' && (
                    <div className="w-full animate-in fade-in">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-slate-400 text-xl font-bold">Pregunta {gameState.currentQuestion + 1} / {EXAM_QUESTIONS.length}</span>
                            <div className="text-4xl font-mono font-bold flex items-center gap-3">
                                <Timer className={timer < 5 ? "text-red-500 animate-pulse" : "text-white"} />
                                {timer}s
                            </div>
                        </div>
                        
                        {/* Question Banner */}
                        <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl text-center mb-8 border-b-8 border-indigo-500">
                            <h2 className="text-3xl md:text-4xl font-black">{currentQ.q}</h2>
                        </div>

                        {/* Options Grid (Non-clickable for host) */}
                        <div className="grid grid-cols-2 gap-4 h-64">
                            {currentQ.opts.map((opt, i) => (
                                <div key={i} className={`${COLORS[i % 4]} border-b-8 rounded-xl flex items-center p-6 shadow-lg`}>
                                    <span className="text-4xl font-black text-white/50 mr-4">{ICONS[i % 4]}</span>
                                    <span className="text-2xl font-bold text-white">{opt}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            <Button variant="ghost" onClick={showLeaderboard} className="text-slate-500 hover:text-white">
                                Forzar Fin Tiempo
                            </Button>
                        </div>
                    </div>
                )}

                {(gameState.status === 'leaderboard' || gameState.status === 'finished') && (
                    <div className="text-center animate-in zoom-in">
                        <h2 className="text-4xl font-black mb-8 flex items-center justify-center gap-3">
                            <Trophy className="text-yellow-400" size={48} />
                            {gameState.status === 'finished' ? "PODIO FINAL" : "CLASIFICACIÓN"}
                        </h2>

                        <div className="max-w-2xl mx-auto space-y-4">
                            {players.sort((a, b) => b.score - a.score).slice(0, 5).map((p, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? 'bg-yellow-500 text-black transform scale-110 shadow-xl border-4 border-yellow-300' : 'bg-slate-800 text-white border border-slate-700'}`}>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-black text-2xl w-8 ${i===0 ? 'text-black' : 'text-slate-500'}`}>#{i + 1}</span>
                                        <span className="font-bold text-xl">{p.name}</span>
                                        {p.streak > 2 && <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">🔥 {p.streak}</span>}
                                    </div>
                                    <span className="font-mono font-bold text-2xl">{p.score}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            {gameState.status === 'finished' ? (
                                <Button size="xl" variant="danger" onClick={onExit}>Salir</Button>
                            ) : (
                                <Button size="xl" variant="primary" onClick={nextQuestion} rightIcon={<ArrowRight />}>
                                    {t('nextQuestion')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * PLAYER COMPONENT (STUDENT)
 */
export const BattlePlayer = ({ onBack }: { onBack: () => void }) => {
    const { user, profile } = useGame();
    const { t } = useLanguage();
    const [code, setCode] = useState('');
    const [joined, setJoined] = useState(false);
    const [gameState, setGameState] = useState<any>(null);
    const [myScore, setMyScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

    // Sync Game
    useEffect(() => {
        if (!joined || !code) return;
        
        const battleRef = ref(rtdb, `battles/${code}`);
        const unsub = onValue(battleRef, (snap) => {
            const data = snap.val();
            if (data) {
                setGameState(data);
                
                // Check my specific status
                if (data.players && data.players[user.uid]) {
                    const me = data.players[user.uid];
                    setMyScore(me.score || 0);
                    // If moving from playing to leaderboard, verify last result
                    if (data.status === 'leaderboard') {
                        setAnswered(false); // Reset for next q
                        setLastResult(me.lastCorrect ? 'correct' : 'wrong');
                        playSound(me.lastCorrect ? 'success' : 'error');
                    } else if (data.status === 'playing') {
                        setLastResult(null); // Reset UI
                    }
                } else {
                    // Kicked or room deleted
                    setJoined(false);
                }
            } else {
                setJoined(false);
            }
        });
        return () => unsub();
    }, [joined, code, user.uid]);

    const joinBattle = async () => {
        if (code.length !== 4) return;
        playSound('click');
        
        const playerRef = ref(rtdb, `battles/${code}/players/${user.uid}`);
        try {
            await set(playerRef, {
                name: profile?.name || "Alumno",
                score: 0,
                streak: 0
            });
            setJoined(true);
        } catch (e) {
            console.error(e);
            alert("Error al unirse. Verifica el código.");
        }
    };

    const submitAnswer = (optionText: string) => {
        if (answered || gameState.status !== 'playing') return;
        playSound('click');
        setAnswered(true);
        
        const answerRef = ref(rtdb, `battles/${code}/answers/${user.uid}`);
        set(answerRef, {
            answer: optionText,
            timestamp: serverTimestamp()
        });
    };

    if (!joined) {
        return (
            <div className="max-w-md mx-auto p-8 flex flex-col justify-center min-h-[50vh] animate-in zoom-in">
                <div className="text-center mb-8">
                    <Monitor size={64} className="mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-3xl font-black text-gray-800">{t('battleMode')}</h2>
                    <p className="text-gray-500">{t('battleDesc')}</p>
                </div>
                <Card className="p-6 border-2 border-indigo-100">
                    <Input 
                        placeholder="0000" 
                        value={code} 
                        onChange={e => setCode(e.target.value)} 
                        maxLength={4} 
                        className="text-center text-4xl tracking-widest font-mono font-black mb-4"
                    />
                    <Button fullWidth variant="primary" size="lg" onClick={joinBattle} disabled={code.length !== 4}>
                        {t('joinBattle')}
                    </Button>
                </Card>
                <Button variant="ghost" onClick={onBack} className="mt-4">Cancelar</Button>
            </div>
        );
    }

    // WAITING LOBBY
    if (gameState?.status === 'waiting') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 text-white p-8 text-center animate-in fade-in">
                <h2 className="text-4xl font-black mb-4">{t('battleLobby')}</h2>
                <p className="text-xl opacity-90 mb-8">¡Estás dentro, {profile?.name}!</p>
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                <p className="animate-pulse">{t('waitingHost')}</p>
            </div>
        );
    }

    // GAMEPLAY
    if (gameState?.status === 'playing') {
        const currentQ = EXAM_QUESTIONS[gameState.currentQuestion];
        
        if (answered) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8 text-center animate-in zoom-in">
                    <div className="bg-white p-8 rounded-full shadow-xl mb-6">
                        <CheckCircle2 size={64} className="text-indigo-500 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700">Respuesta Enviada</h2>
                    <p className="text-slate-500">Espera a que termine el tiempo...</p>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-slate-100 flex flex-col p-4">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4 text-center">
                    <p className="text-slate-500 text-sm font-bold uppercase">Pregunta {gameState.currentQuestion + 1}</p>
                    {/* Optionally hide text for true Kahoot style, but showing here for usability */}
                    <p className="font-bold text-lg mt-1">{currentQ.q}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                    {currentQ.opts.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => submitAnswer(opt)}
                            className={`${COLORS[i % 4]} text-white rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform border-b-8 active:border-b-0 active:translate-y-2`}
                        >
                            <span className="text-5xl mb-2">{ICONS[i % 4]}</span>
                            <span className="font-bold text-lg px-2">{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // RESULTS / LEADERBOARD FEEDBACK
    if (gameState?.status === 'leaderboard' || gameState?.status === 'finished') {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center animate-in zoom-in ${lastResult === 'correct' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                {lastResult === 'correct' ? (
                    <>
                        <h2 className="text-5xl font-black mb-2">{t('correct')}</h2>
                        <div className="bg-white/20 p-4 rounded-full mb-6 backdrop-blur-sm">
                            <CheckCircle2 size={80} />
                        </div>
                        <p className="text-2xl font-bold">+Puntos</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-5xl font-black mb-2">{t('incorrect')}</h2>
                        <div className="bg-white/20 p-4 rounded-full mb-6 backdrop-blur-sm">
                            <XCircle size={80} />
                        </div>
                        <p className="text-xl opacity-90">¡Ánimo para la siguiente!</p>
                    </>
                )}
                
                <div className="mt-12 bg-black/30 p-6 rounded-2xl w-full max-w-sm backdrop-blur-md">
                    <p className="text-sm uppercase tracking-widest opacity-75">Tu Puntuación Total</p>
                    <p className="text-5xl font-mono font-black">{myScore}</p>
                </div>

                {gameState.status === 'finished' && (
                    <Button variant="glass" onClick={onBack} className="mt-8">Salir</Button>
                )}
            </div>
        );
    }

    return null;
};