import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Zap, Activity, Clock, Crown, Users, AlertTriangle } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { selectRandomQuestions } from '../../utils/examRandomizer';

const LiveClassroom = ({ students, t, onExit, db, firebaseConfigId, examQuestions }) => {
    const [feed, setFeed] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [tournamentMode, setTournamentMode] = useState(false);
    const [bracket, setBracket] = useState([]);

    useEffect(() => {
        // Sort for leaderboard
        const sorted = [...students].sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0)).slice(0, 10);
        setLeaderboard(sorted);

        // Simulate activity feed
        const generateActivity = () => {
            const actions = ['leveledUp', 'badge', 'exam', 'login'];
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];

            if (!randomStudent) return;

            let text = "";
            let icon = <Activity size={16} />;
            let color = "text-slate-400";

            if (action === 'leveledUp') {
                text = `${randomStudent.name} reached Level ${randomStudent.progress?.level || 2}!`;
                icon = <Flame size={16} />; color = "text-orange-500";
            } else if (action === 'badge') {
                text = `${randomStudent.name} earned a new badge!`;
                icon = <Trophy size={16} />; color = "text-yellow-500";
            } else {
                text = `${randomStudent.name} is active now.`;
                icon = <Zap size={16} />; color = "text-blue-500";
            }

            setFeed(prev => [{ id: Date.now(), text, icon, color, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
        };

        const interval = setInterval(generateActivity, 5000);
        return () => clearInterval(interval);
    }, [students]);

    const generateTournament = () => {
        const top8 = [...students].sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0)).slice(0, 8);
        if (top8.length < 8) {
            alert("Need at least 8 students for tournament!");
            return;
        }

        // Shuffle for random matchups
        const shuffled = top8.sort(() => Math.random() - 0.5);

        // Create bracket: [quarters, semis, final, winner]
        const quarters = [
            { p1: shuffled[0], p2: shuffled[1], winner: null },
            { p1: shuffled[2], p2: shuffled[3], winner: null },
            { p1: shuffled[4], p2: shuffled[5], winner: null },
            { p1: shuffled[6], p2: shuffled[7], winner: null }
        ];

        // Auto-advance based on XP
        quarters.forEach(match => {
            match.winner = (match.p1.progress?.xp || 0) > (match.p2.progress?.xp || 0) ? match.p1 : match.p2;
        });

        const semis = [
            { p1: quarters[0].winner, p2: quarters[1].winner, winner: null },
            { p1: quarters[2].winner, p2: quarters[3].winner, winner: null }
        ];

        semis.forEach(match => {
            match.winner = (match.p1.progress?.xp || 0) > (match.p2.progress?.xp || 0) ? match.p1 : match.p2;
        });

        const final = { p1: semis[0].winner, p2: semis[1].winner, winner: null };
        final.winner = (final.p1.progress?.xp || 0) > (final.p2.progress?.xp || 0) ? final.p1 : final.p2;

        setBracket({ quarters, semis, final });
        setTournamentMode(true);
    };

    const launchSurpriseExam = async () => {
        if (!db || !firebaseConfigId || !examQuestions) {
            alert('Missing required props for Surprise Exam');
            return;
        }

        try {
            const randomQuestions = selectRandomQuestions(examQuestions, 20);
            await setDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'active_surprise_exam'), {
                active: true,
                questions: randomQuestions,
                startedAt: new Date().toISOString(),
                duration: 600
            });
            alert('🚨 SURPRISE EXAM LAUNCHED!\n\nAll connected students will now see the exam modal.');
        } catch (error) {
            console.error('Error launching surprise exam:', error);
            alert('Error launching surprise exam. Check console.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 text-white z-[100] flex flex-col overflow-hidden font-['Inter']">
            {/* Header */}
            <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <h1 className="text-2xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        {tournamentMode ? (t?.tournament?.title || "TOURNAMENT") : (t?.live?.title || "LIVE CONTROL ROOM")}
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    {!tournamentMode && (
                        <>
                            <button onClick={generateTournament} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-bold transition-all flex items-center gap-2">
                                <Trophy size={20} /> {t?.tournament?.start || "Start Tournament"}
                            </button>
                            <button
                                onClick={launchSurpriseExam}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg font-bold transition-all flex items-center gap-2"
                            >
                                <AlertTriangle size={20} /> 🚨 Surprise Exam
                            </button>
                        </>
                    )}
                    {tournamentMode && (
                        <button onClick={() => setTournamentMode(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">
                            Back to Live
                        </button>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <Clock size={18} />
                        <span className="text-xl">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <button onClick={onExit} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors">
                        EXIT
                    </button>
                </div>
            </div>

            <div className="flex-1 flex p-8 gap-8 overflow-hidden">
                {!tournamentMode ? (
                    <>
                        {/* Leaderboard */}
                        <div className="flex-[2] flex flex-col gap-6">
                            <div className="flex items-center gap-3 text-yellow-500 mb-2">
                                <Crown size={32} />
                                <h2 className="text-3xl font-black">{t?.live?.leaderboard || "LEADERBOARD"}</h2>
                            </div>
                            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                                {leaderboard.map((s, i) => (
                                    <div key={i} className={`flex items-center p-4 rounded-xl border ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : i === 1 ? 'bg-slate-800/50 border-slate-700' : i === 2 ? 'bg-orange-900/20 border-orange-800' : 'bg-slate-900 border-slate-800'} transform transition-all hover:scale-[1.01]`}>
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg font-black text-xl mr-6 ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold truncate">{s.name}</h3>
                                            <p className="text-slate-500 text-sm flex gap-3">
                                                <span>Level {s.progress?.level || 1}</span>
                                                <span className="text-slate-700">|</span>
                                                <span>{s.role}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-3xl font-black ${i === 0 ? 'text-yellow-500' : 'text-slate-300'}`}>{s.progress?.xp || 0}</p>
                                            <p className="text-xs text-slate-500 uppercase font-bold">XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feed */}
                        <div className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 p-6 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-3">
                                <Activity className="text-brand-500" /> {t?.live?.feed || "ACTIVITY FEED"}
                            </h3>
                            <div className="space-y-4">
                                {feed.length === 0 && <p className="text-slate-600 italic text-center text-sm">{t?.live?.waiting || "Waiting for signals..."}</p>}
                                {feed.map(f => (
                                    <div key={f.id} className="flex gap-4 p-3 border-b border-slate-800/50 animate-in slide-in-from-right-4 fade-in duration-500">
                                        <div className={`mt-1 ${f.color}`}>{f.icon}</div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-lg leading-tight">{f.text}</p>
                                            <p className="text-xs text-slate-600 font-mono mt-1">{f.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Active Count */}
                            <div className="mt-auto bg-slate-800 rounded-xl p-6 text-center">
                                <p className="text-5xl font-black text-white mb-2">{students.length}</p>
                                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {t?.analytics?.students || "Total Students"}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Tournament Bracket */
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="grid grid-cols-4 gap-8 w-full max-w-6xl">
                            {/* Quarters */}
                            <div className="space-y-6">
                                <h3 className="text-center font-bold text-yellow-500 mb-4">{t?.tournament?.round1 || "QUARTERS"}</h3>
                                {bracket.quarters?.map((match, i) => (
                                    <div key={i} className="bg-slate-800 rounded-lg p-3 border-2 border-slate-700">
                                        <div className={`p-2 rounded ${match.winner?.userId === match.p1?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold text-sm truncate">{match.p1?.name}</p>
                                            <p className="text-xs text-slate-400">{match.p1?.progress?.xp || 0} XP</p>
                                        </div>
                                        <div className="text-center text-xs text-slate-600 my-1">VS</div>
                                        <div className={`p-2 rounded ${match.winner?.userId === match.p2?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold text-sm truncate">{match.p2?.name}</p>
                                            <p className="text-xs text-slate-400">{match.p2?.progress?.xp || 0} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Semis */}
                            <div className="space-y-6 flex flex-col justify-center">
                                <h3 className="text-center font-bold text-orange-500 mb-4">{t?.tournament?.round2 || "SEMIS"}</h3>
                                {bracket.semis?.map((match, i) => (
                                    <div key={i} className="bg-slate-800 rounded-lg p-3 border-2 border-orange-700/50">
                                        <div className={`p-2 rounded ${match.winner?.userId === match.p1?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold text-sm truncate">{match.p1?.name}</p>
                                            <p className="text-xs text-slate-400">{match.p1?.progress?.xp || 0} XP</p>
                                        </div>
                                        <div className="text-center text-xs text-slate-600 my-1">VS</div>
                                        <div className={`p-2 rounded ${match.winner?.userId === match.p2?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold text-sm truncate">{match.p2?.name}</p>
                                            <p className="text-xs text-slate-400">{match.p2?.progress?.xp || 0} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Final */}
                            <div className="flex flex-col justify-center">
                                <h3 className="text-center font-bold text-red-500 mb-4">{t?.tournament?.final || "FINAL"}</h3>
                                {bracket.final && (
                                    <div className="bg-slate-800 rounded-lg p-4 border-2 border-red-700/50">
                                        <div className={`p-3 rounded ${bracket.final.winner?.userId === bracket.final.p1?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold truncate">{bracket.final.p1?.name}</p>
                                            <p className="text-xs text-slate-400">{bracket.final.p1?.progress?.xp || 0} XP</p>
                                        </div>
                                        <div className="text-center text-xs text-slate-600 my-2">VS</div>
                                        <div className={`p-3 rounded ${bracket.final.winner?.userId === bracket.final.p2?.userId ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-slate-900'}`}>
                                            <p className="font-bold truncate">{bracket.final.p2?.name}</p>
                                            <p className="text-xs text-slate-400">{bracket.final.p2?.progress?.xp || 0} XP</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Winner */}
                            <div className="flex flex-col justify-center items-center">
                                <h3 className="text-center font-bold text-yellow-500 mb-4">{t?.tournament?.winner || "WINNER"}</h3>
                                {bracket.final?.winner && (
                                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl animate-pulse">
                                        <Trophy size={48} className="mx-auto mb-3 text-white" />
                                        <p className="font-black text-2xl text-center text-white mb-1">{bracket.final.winner.name}</p>
                                        <p className="text-center text-yellow-100 text-sm font-bold">{bracket.final.winner.progress?.xp || 0} XP</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveClassroom;
