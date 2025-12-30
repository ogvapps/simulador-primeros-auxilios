import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, AlertTriangle, Trophy, TrendingUp, Crown } from 'lucide-react';
import ErrorHeatmap from './ErrorHeatmap';
import { EXAM_QUESTIONS } from '../../data/constants';

// Color Palette
const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

const AnalyticsDashboard = ({ students, badgeModules, t }) => {

    // --- DATA TRANSFORMATION ---
    const levelData = useMemo(() => {
        const levels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        students.forEach(s => {
            const lvl = s.progress?.level || 1;
            if (levels[lvl] !== undefined) levels[lvl]++;
        });
        return Object.entries(levels).map(([lvl, count]) => ({
            name: `${t?.analytics?.chart?.level || 'Lvl'} ${lvl}`,
            count
        }));
    }, [students, t]);

    const moduleData = useMemo(() => {
        return badgeModules.map(m => {
            const completedCount = students.filter(s => s.progress?.[`${m.id}Completed`]).length;
            const percentage = Math.round((completedCount / students.length) * 100) || 0;
            return {
                name: m.title.substring(0, 10) + '...', // Truncate for display
                fullName: m.title,
                value: percentage
            };
        });
    }, [students, badgeModules]);

    const classPerformanceData = useMemo(() => {
        const classes = {};
        students.forEach(s => {
            const role = s.role || 'Sin Clase';
            if (!classes[role]) classes[role] = { totalXp: 0, count: 0 };
            classes[role].totalXp += s.progress?.xp || 0;
            classes[role].count++;
        });

        return Object.entries(classes).map(([role, data]) => ({
            name: role,
            avgXp: Math.round(data.totalXp / data.count)
        })).sort((a, b) => b.avgXp - a.avgXp);
    }, [students]);

    const examData = useMemo(() => {
        const passed = students.filter(s => s.progress?.examenPassed).length;
        const total = students.length;
        const pending = total - passed;
        return [
            { name: t?.analytics?.passed || 'Passed', value: passed },
            { name: t?.analytics?.pending || 'Pending', value: pending }
        ];
    }, [students, t]);

    const atRiskStudents = useMemo(() => {
        const now = new Date();
        return students.filter(s => {
            const lastActive = new Date(s.lastUpdate);
            const diffDays = (now - lastActive) / (1000 * 60 * 60 * 24);
            return diffDays > 7;
        }).slice(0, 5); // Top 5
    }, [students]);

    const topStudents = useMemo(() => {
        return [...students].sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0)).slice(0, 3);
    }, [students]);

    const topByClass = useMemo(() => {
        const classes = {};
        students.forEach(s => {
            const role = s.role || 'Sin Clase';
            if (!classes[role] || (s.progress?.xp || 0) > (classes[role].xp || 0)) {
                classes[role] = { name: s.name, xp: s.progress?.xp || 0, role };
            }
        });
        return Object.values(classes).sort((a, b) => b.xp - a.xp);
    }, [students]);

    if (!students.length) return <div className="p-10 text-center text-slate-400">{t?.analytics?.noData || "No Data"}</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t?.analytics?.students}</p>
                        <Users className="text-blue-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-slate-800">{students.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t?.analytics?.passRate}</p>
                        <Trophy className="text-yellow-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-slate-800">
                        {Math.round((examData[0].value / students.length) * 100)}%
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t?.analytics?.risk}</p>
                        <AlertTriangle className="text-red-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-slate-800">{atRiskStudents.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t?.analytics?.active}</p>
                        <TrendingUp className="text-green-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-slate-800">
                        {students.filter(s => (new Date() - new Date(s.lastUpdate)) < 86400000).length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PERFORMANCE BY CLASS CHART */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-4">{t?.analytics?.classPerformance || "Class Performance (Avg XP)"}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classPerformanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="avgXp" name={t?.analytics?.chart?.avgXp || "Avg XP"} fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LEVEL DISTRIBUTION CHART */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-4">{t?.analytics?.levelDist}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={levelData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="count" name={t?.analytics?.chart?.count} fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* MODULE PROGRESS AREA CHART */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-slate-700 mb-4">{t?.analytics?.moduleProg}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={moduleData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" name={t?.analytics?.chart?.completion} stroke="#8B5CF6" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ELITE BY CLASS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Crown size={18} className="text-yellow-500" /> {t?.analytics?.topByClass || "Top Students by Class"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topByClass.map((s, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase mb-1">{s.role}</span>
                                <span className="font-bold text-slate-800 text-sm mb-1">{s.name}</span>
                                <span className="text-xs text-brand-600 font-black bg-brand-50 px-2 py-0.5 rounded-full">{s.xp.toLocaleString()} XP</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* INSIGHTS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" /> {t?.analytics?.atRisk || "At Risk Students"}
                    </h3>
                    {atRiskStudents.length > 0 ? (
                        <ul className="space-y-3">
                            {atRiskStudents.map(s => (
                                <li key={s.userId} className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                                    <span className="font-bold text-slate-700 text-sm">{s.name} ({s.role})</span>
                                    <span className="text-xs text-red-500 font-bold bg-white px-2 py-1 rounded-full">
                                        {Math.floor((new Date() - new Date(s.lastUpdate)) / (1000 * 60 * 60 * 24))}d
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 text-sm italic">{t?.analytics?.noRisk || "No students at risk."}</p>
                    )}
                </div>

                {/* EXAM PIE CHART (smaller) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-4">{t?.analytics?.examStatus}</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={examData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                    {examData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#E5E7EB'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ERROR HEATMAP */}
            <div className="mt-8">
                <ErrorHeatmap students={students} questionBank={EXAM_QUESTIONS || []} t={t} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
