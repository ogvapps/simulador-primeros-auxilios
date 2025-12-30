import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Zap, Award, Users } from 'lucide-react';
import { generateBenchmark, getPerformanceTier } from '../../utils/benchmarking';
import { collection, getDocs } from 'firebase/firestore';

const BenchmarkCard = ({ student, db, firebaseConfigId, t }) => {
    const [benchmark, setBenchmark] = useState(null);
    const [averages, setAverages] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBenchmark();
    }, [student]);

    const loadBenchmark = async () => {
        try {
            // Fetch all students for comparison
            const summariesRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries');
            const snapshot = await getDocs(summariesRef);
            const allStudents = snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }));

            if (allStudents.length < 2) {
                setBenchmark(null);
                setLoading(false);
                return;
            }

            // Calculate simple averages
            const totalXP = allStudents.reduce((acc, s) => acc + (s.progress?.xp || 0), 0);
            const avgXP = Math.round(totalXP / allStudents.length);

            const totalLevel = allStudents.reduce((acc, s) => acc + (s.progress?.level || 1), 0);
            const avgLevel = (totalLevel / allStudents.length).toFixed(1);

            const benchmarkData = generateBenchmark(student, allStudents);

            setBenchmark(benchmarkData);
            setAverages({ xp: avgXP, level: avgLevel });

        } catch (e) {
            console.error('Error loading benchmark:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />;

    if (!benchmark || !averages) return (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-400 font-bold">{t?.benchmark?.missingData || "Not enough data to compare."}</p>
        </div>
    );

    const getInsight = () => {
        if (student.progress?.xp > averages.xp * 1.5) return { text: t?.benchmark?.insights?.excellent || "Excellent Performance", color: "text-green-600", bg: "bg-green-100" };
        if (student.progress?.xp > averages.xp) return { text: t?.benchmark?.insights?.aboveAvg || "Above Average", color: "text-blue-600", bg: "bg-blue-100" };
        if (student.progress?.xp < averages.xp * 0.5) return { text: t?.benchmark?.insights?.belowAvg || "Needs Improvement", color: "text-red-600", bg: "bg-red-100" };
        return { text: t?.benchmark?.insights?.avg || "Average", color: "text-slate-600", bg: "bg-slate-100" };
    };

    const insight = getInsight();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Header with Insight Badge */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-slate-800 text-xl">{student.name}</h3>
                    <p className="text-sm text-slate-500 font-bold">{student.role || 'Sin Clase'}</p>
                </div>
                <div className={`px-3 py-1 rounded-full font-black text-xs uppercase ${insight.bg} ${insight.color}`}>
                    {insight.text}
                </div>
            </div>

            {/* Visual Comparison: XP */}
            <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>{t?.benchmark?.studentXp || "Student XP"}: {student.progress?.xp || 0}</span>
                    <span>{t?.benchmark?.classAvg || "Class Avg"}: {averages.xp}</span>
                </div>
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                    {/* Average Marker Line */}
                    <div className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10" style={{ left: '50%' }} title={t?.benchmark?.classAvg || "Class Avg"} />

                    {/* Student Progress relative to average (normalized to visual scale) */}
                    <div
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ${student.progress?.xp >= averages.xp ? 'bg-green-500' : 'bg-red-400'}`}
                        style={{ width: `${Math.min(100, (student.progress?.xp / (averages.xp * 2)) * 100)}%` }} // Scale roughly so avg is middle
                    />
                </div>
                <p className="text-xs text-center mt-1 text-slate-400">
                    {t?.benchmark?.xpComparison || "XP vs Average Comparison"}
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t?.benchmark?.xpDiff || "XP Difference"}</p>
                    <p className={`text-xl font-black ${(student.progress?.xp - averages.xp) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {(student.progress?.xp - averages.xp) > 0 ? '+' : ''}{student.progress?.xp - averages.xp}
                    </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">{t?.benchmark?.levelVsClass || "Level vs Class"}</p>
                    <p className="text-xl font-black text-slate-700">
                        {student.progress?.level || 1} <span className="text-sm text-slate-400 font-normal">/ {averages.level}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkCard;
