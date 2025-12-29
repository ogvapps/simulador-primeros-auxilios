import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Zap, Award } from 'lucide-react';
import { generateBenchmark, getPerformanceTier } from '../../utils/benchmarking';
import { collection, getDocs } from 'firebase/firestore';

const BenchmarkCard = ({ student, db, firebaseConfigId, t }) => {
    const [benchmark, setBenchmark] = useState(null);
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

            const benchmarkData = generateBenchmark(student, allStudents);
            setBenchmark(benchmarkData);
        } catch (e) {
            console.error('Error loading benchmark:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-slate-100 rounded"></div>
            </div>
        );
    }

    if (!benchmark) {
        return (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                <Target className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-500 text-sm font-bold">{t?.benchmark?.needData || "Necesita más datos"}</p>
                <p className="text-slate-400 text-xs mt-1">{t?.benchmark?.minStudents || "Se requieren al menos 2 estudiantes"}</p>
            </div>
        );
    }

    const tier = getPerformanceTier(benchmark.xp.percentile);

    const MetricRow = ({ icon: Icon, label, data, iconColor }) => {
        if (!data) return null;

        const TrendIcon = data.vsAverage > 5 ? TrendingUp : data.vsAverage < -5 ? TrendingDown : Minus;
        const trendColor = data.vsAverage > 5 ? 'text-green-600' : data.vsAverage < -5 ? 'text-red-600' : 'text-slate-400';

        return (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                    <Icon size={20} className={iconColor} />
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{label}</p>
                        <p className="text-xs text-slate-500">{t?.benchmark?.top || 'Top'} {100 - data.percentile}%</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-slate-900">{data.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                        <TrendIcon size={14} className={trendColor} />
                        <span className={`font-bold ${trendColor}`}>
                            {data.vsAverage > 0 ? '+' : ''}{data.vsAverage}%
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Trophy size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-blue-900">{t?.benchmark?.performance || "Rendimiento Relativo"}</h3>
                        <p className="text-xs text-blue-600">{(t?.benchmark?.vsClassmates || 'vs {n} compañeros').replace('{n}', benchmark.classSize)}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full ${tier.bg} ${tier.border} border-2`}>
                    <p className={`font-black text-sm ${tier.color}`}>{tier.name}</p>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <MetricRow icon={Zap} label="XP Total" data={benchmark.xp} iconColor="text-yellow-600" />
                <MetricRow icon={Target} label="Nivel" data={benchmark.level} iconColor="text-blue-600" />
                {benchmark.examScore && (
                    <MetricRow icon={Award} label="Nota Examen" data={benchmark.examScore} iconColor="text-green-600" />
                )}
            </div>

            <div className="bg-white/50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-600 font-bold">
                    {t?.benchmark?.betterThan || "Mejor que el"} <span className="text-blue-600 text-lg font-black">{benchmark.xp.percentile}%</span> {t?.benchmark?.ofClass || "de la clase"}
                </p>
            </div>
        </div>
    );
};

export default BenchmarkCard;
