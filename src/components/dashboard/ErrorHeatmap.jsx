import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Download, AlertOctagon } from 'lucide-react';
import { generateErrorHeatmap, getErrorColor } from '../../utils/errorHeatmap';

const ErrorHeatmap = ({ students, questionBank, t }) => {
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        if (students && questionBank) {
            const data = generateErrorHeatmap(students, questionBank);
            // Sort by error rate (highest first) and take top 5
            data.sort((a, b) => b.errorRate - a.errorRate);
            setHeatmapData(data.slice(0, 5));
        }
    }, [students, questionBank]);

    if (!heatmapData.length || heatmapData.every(d => d.totalAttempts === 0)) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-400 text-sm font-bold italic">{t?.analytics?.noErrorData || "Not enough error data yet."}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-2 rounded-lg">
                    <AlertOctagon className="text-red-600" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800">
                        {t?.analytics?.focusAreas || "Critical Concepts Detected"}
                    </h3>
                    <p className="text-slate-500 text-xs">
                        {t?.analytics?.focusSubtitle || "Top 5 questions with the highest failure rate."}
                    </p>
                </div>
            </div>

            {/* List of Critical Failures */}
            <div className="space-y-4">
                {heatmapData.map((stat, idx) => {
                    const isCritical = stat.errorRate > 50;
                    return (
                        <div key={idx} className="relative pl-4 border-l-4 border-slate-200 hover:border-red-400 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-slate-700 text-sm line-clamp-2 pr-4">
                                    "{stat.question}"
                                </p>
                                <span className={`text-xs font-black px-2 py-1 rounded-md ${isCritical ? 'bg-red-100 text-red-600' : 'bg-orange-50 text-orange-500'}`}>
                                    {stat.errorRate}% {t?.analytics?.failures || "Failures"}
                                </span>
                            </div>

                            {/* Simple Visual Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-orange-400'}`}
                                    style={{ width: `${stat.errorRate}%` }}
                                />
                            </div>

                            {/* Insight Text */}
                            {isCritical && (
                                <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                                    <AlertTriangle size={10} /> {stat.wrongAnswers} {t?.analytics?.of || "of"} {stat.totalAttempts} {t?.analytics?.studentsFailed || "students failed here."}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                <p className="text-orange-800 text-xs font-bold">
                    💡 {t?.analytics?.recommendation || "Recommendation: Review the module for these topics in the next class."}
                </p>
            </div>
        </div>
    );
};

export default ErrorHeatmap;
