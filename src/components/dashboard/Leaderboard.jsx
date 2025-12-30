import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Trophy, Medal, Crown, ArrowLeft, Loader2, Users, Filter } from 'lucide-react';
import { AVATARS, LEAGUES } from '../../data/constants';

const Leaderboard = ({ db, firebaseConfigId, onBack, currentUserId, currentUserRole, t }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('global'); // 'global', 'weekly', 'class'
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const collRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries');
                const snap = await getDocs(collRef);

                const users = [];
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.progress && d.progress.xp !== undefined) {
                        users.push({
                            id: d.userId || doc.id,
                            name: d.name || 'Anónimo',
                            role: d.role || 'Sin Clase',
                            xp: d.progress.xp || 0,
                            lifetimeXp: d.progress.lifetimeXp !== undefined ? d.progress.lifetimeXp : (d.progress.xp || 0),
                            weeklyXP: d.progress.weeklyXP || 0,
                            level: d.progress.level || 1,
                            avatar: d.avatarId || 'default'
                        });
                    }
                });

                setLeaders(users);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        if (db && firebaseConfigId) fetchLeaders();
    }, [db, firebaseConfigId]);

    const uniqueRoles = useMemo(() => {
        if (!leaders.length) return [];
        const roles = [...new Set(leaders.map(u => u.role))].filter(Boolean);
        return roles.sort();
    }, [leaders]);

    const displayedLeaders = useMemo(() => {
        let sorted = [...leaders];

        // 1. Filter
        if (filter === 'class') {
            if (currentUserRole === 'admin' && selectedRole) {
                sorted = sorted.filter(u => u.role === selectedRole);
            } else if (currentUserRole !== 'admin') {
                sorted = sorted.filter(u => u.role === currentUserRole);
            }
        }

        // 2. Sort
        if (filter === 'weekly') {
            sorted.sort((a, b) => b.weeklyXP - a.weeklyXP);
        } else {
            // Global or Class (usually lifetime XP matters most)
            sorted.sort((a, b) => b.lifetimeXp - a.lifetimeXp);
        }

        return sorted.slice(0, 50);
    }, [leaders, filter, currentUserRole, selectedRole]);

    const getRankIcon = (rank) => {
        if (rank === 0) return <Crown className="text-yellow-500 fill-yellow-500" size={32} />;
        if (rank === 1) return <Medal className="text-slate-400 fill-slate-400" size={28} />;
        if (rank === 2) return <Medal className="text-amber-700 fill-amber-700" size={28} />;
        return <span className="font-black text-slate-400 text-xl w-8 text-center">{rank + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <Trophy className="text-yellow-500" size={32} /> {t?.leaderboard?.title || "Leaderboard"}
                            </h1>
                            <p className="text-slate-500 font-medium">{t?.leaderboard?.subtitle || "Top Students by XP"}</p>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Period/Mode Toggles */}
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setFilter('global')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'global' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t?.leaderboard?.global || "Global"}
                            </button>
                            <button
                                onClick={() => setFilter('weekly')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'weekly' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t?.leaderboard?.weekly || "Semanal"}
                            </button>
                            {currentUserRole !== 'admin' && (
                                <button
                                    onClick={() => setFilter('class')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'class' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {t?.leaderboard?.myClass || "Mi Clase"}
                                </button>
                            )}
                        </div>

                        {/* Admin Specific Class Filter */}
                        {currentUserRole === 'admin' && (
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${filter === 'class' ? 'text-brand-500' : 'text-slate-400'}`}>
                                    <Filter size={16} />
                                </div>
                                <select
                                    onChange={(e) => {
                                        setFilter('class');
                                        setSelectedRole(e.target.value);
                                    }}
                                    value={filter === 'class' && selectedRole ? selectedRole : ''}
                                    className={`
                                        appearance-none pl-10 pr-8 py-2.5 rounded-xl font-bold text-sm border-2 outline-none cursor-pointer transition-all min-w-[200px]
                                        ${filter === 'class'
                                            ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <option value="" disabled>Filtrar por Clase</option>
                                    {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <Users size={14} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
                        <p className="font-bold text-slate-400">{t?.leaderboard?.loading || "Cargando..."}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        {displayedLeaders.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>{t?.leaderboard?.noData || "No hay datos disponibles."}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {displayedLeaders.map((user, idx) => {
                                    const isMe = user.id === currentUserId;
                                    const avatarDef = AVATARS.find(a => a.id === user.avatar) || AVATARS[0];

                                    const league = LEAGUES.find(l => idx >= l.minRank && idx <= l.maxRank) || LEAGUES[LEAGUES.length - 1];
                                    const prevLeague = idx > 0 ? (LEAGUES.find(l => (idx - 1) >= l.minRank && (idx - 1) <= l.maxRank) || LEAGUES[LEAGUES.length - 1]) : null;
                                    const showLeagueHeader = filter === 'global' && (!prevLeague || prevLeague.id !== league.id);

                                    return (
                                        <React.Fragment key={user.id}>
                                            {showLeagueHeader && (
                                                <div className={`px-4 py-2 bg-gradient-to-r ${league.color} text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm`}>
                                                    <span className="text-lg">{league.icon}</span> {(t?.leaderboard?.league || "LIGA {name}").replace('{name}', league.name)}
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
                                                        {avatarDef.icon ? avatarDef.icon : user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="truncate pr-4">
                                                        <h3 className={`font-bold text-lg truncate ${isMe ? 'text-brand-700' : 'text-slate-800'}`}>
                                                            {user.name} {isMe && (t?.leaderboard?.you || '(Tú)')}
                                                        </h3>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            {user.role} • Nvl {user.level}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* XP */}
                                                <div className="text-right flex-shrink-0 pl-2">
                                                    <p className="font-black text-2xl text-slate-800">
                                                        {filter === 'weekly' ? user.weeklyXP.toLocaleString() : user.lifetimeXp.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase">
                                                        {filter === 'weekly' ? 'XP SEMANAL' : 'XP TOTAL'}
                                                    </p>
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
