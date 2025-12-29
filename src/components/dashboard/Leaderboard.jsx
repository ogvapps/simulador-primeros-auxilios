import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { Trophy, Medal, Crown, ArrowLeft, Loader2, Users } from 'lucide-react';
import { AVATARS, LEAGUES } from '../../data/constants';

const Leaderboard = ({ db, firebaseConfigId, onBack, currentUserId, t }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                // Fetch all user summaries
                // Indexing might be needed for orderBy('progress.xp', 'desc') if collection is large.
                // For now, fetch all and sort client side to avoid index creation requirements for the user.
                const collRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries');
                const snap = await getDocs(collRef);

                const users = [];
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.progress && d.progress.xp !== undefined) {
                        users.push({
                            id: d.userId || doc.id,
                            name: d.name || 'Anónimo',
                            xp: d.progress.xp || 0,
                            lifetimeXp: d.progress.lifetimeXp !== undefined ? d.progress.lifetimeXp : (d.progress.xp || 0), // Fallback for old users
                            level: d.progress.level || 1,
                            avatar: d.avatarId || 'default'
                        });
                    }
                });

                // Sort DESC by Lifetime XP (Prestige)
                users.sort((a, b) => b.lifetimeXp - a.lifetimeXp);
                setLeaders(users.slice(0, 50)); // Top 50
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        if (db && firebaseConfigId) fetchLeaders();
    }, [db, firebaseConfigId]);

    const getRankIcon = (rank) => {
        if (rank === 0) return <Crown className="text-yellow-500 fill-yellow-500" size={32} />;
        if (rank === 1) return <Medal className="text-slate-400 fill-slate-400" size={28} />; // Silver
        if (rank === 2) return <Medal className="text-amber-700 fill-amber-700" size={28} />; // Bronze
        return <span className="font-black text-slate-400 text-xl w-8 text-center">{rank + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Trophy className="text-yellow-500" size={32} /> {t?.leaderboard?.title || "Clasificación"}
                        </h1>
                        <p className="text-slate-500 font-medium">{t?.leaderboard?.subtitle || "Top Alumnos por Experiencia (XP)"}</p>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
                        <p className="font-bold text-slate-400">{t?.leaderboard?.loading || "Cargando ranking..."}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        {leaders.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>{t?.leaderboard?.noData || "Aún no hay datos suficientes."}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {leaders.map((user, idx) => {
                                    const isMe = user.id === currentUserId;
                                    const avatarDef = AVATARS.find(a => a.id === user.avatar) || AVATARS[0];

                                    // Determine League
                                    const league = LEAGUES.find(l => idx >= l.minRank && idx <= l.maxRank) || LEAGUES[LEAGUES.length - 1];
                                    const prevLeague = idx > 0 ? (LEAGUES.find(l => (idx - 1) >= l.minRank && (idx - 1) <= l.maxRank) || LEAGUES[LEAGUES.length - 1]) : null;
                                    const showLeagueHeader = !prevLeague || prevLeague.id !== league.id;

                                    return (
                                        <React.Fragment key={user.id}>
                                            {showLeagueHeader && (
                                                <div className={`px-4 py-2 bg-gradient-to-r ${league.color} text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm`}>
                                                    <span className="text-lg">{league.icon}</span> {t?.leaderboard?.league ? t.leaderboard.league.replace('{name}', league.name) : `LIGA ${league.name}`}
                                                </div>
                                            )}
                                            <div
                                                className={`
                                                    flex items-center p-5 transition-colors
                                                    ${isMe ? 'bg-yellow-50/50 hover:bg-yellow-50' : 'hover:bg-slate-50'}
                                                `}
                                            >
                                                {/* Rank */}
                                                <div className="w-16 flex justify-center flex-shrink-0">
                                                    {getRankIcon(idx)}
                                                </div>

                                                {/* Avatar & Name */}
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-sm ${avatarDef.color} font-black text-lg`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="truncate pr-4">
                                                        <h3 className={`font-bold text-lg truncate ${isMe ? 'text-brand-700' : 'text-slate-800'}`}>
                                                            {user.name} {isMe && (t?.leaderboard?.you || '(Tú)')}
                                                        </h3>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{avatarDef.name} • Lvl {user.level}</p>
                                                    </div>
                                                </div>

                                                {/* XP */}
                                                <div className="text-right flex-shrink-0 pl-2">
                                                    <p className="font-black text-2xl text-slate-800">{user.lifetimeXp.toLocaleString()}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase">XP TOTAL</p>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
