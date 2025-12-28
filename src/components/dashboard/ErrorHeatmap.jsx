import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { generateErrorHeatmap, getErrorColor } from '../../utils/errorHeatmap';

const ErrorHeatmap = ({ students, questionBank, t }) => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        if (students && questionBank) {
            const data = generateErrorHeatmap(students, questionBank);
            // Sort by error rate (highest first)
            data.sort((a, b) => b.errorRate - a.errorRate);
            setHeatmapData(data);
        }
    }, [students, questionBank]);

    const exportCSV = () => {
        const headers = ['Question #', 'Question Text', 'Total Attempts', 'Wrong Answers', 'Error Rate %'];
        const rows = heatmapData.map(stat => [
            stat.questionIndex + 1,
            `"${stat.question}"`,
            stat.totalAttempts,
            stat.wrongAnswers,
            stat.errorRate
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error_heatmap_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    if (!heatmapData.length) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <AlertTriangle className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold">No exam data yet</p>
                <p className="text-slate-400 text-sm mt-2">Students need to complete exams to generate the heatmap</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        📊 Error Heatmap
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Identify which questions students struggle with most</p>
                </div>
                <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-sm font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-slate-600">Easy (&lt;30%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-slate-600">Medium (30-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-slate-600">Hard (&gt;60%)</span>
                </div>
            </div>

            {/* Heatmap Bars */}
            <div className="space-y-3">
                {heatmapData.map((stat, idx) => {
                    const colors = getErrorColor(stat.errorRate);
                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedQuestion(stat)}
                            className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg} cursor-pointer hover:shadow-lg transition-all`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-10 h-10 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center font-black ${colors.text}`}>
                                        Q{stat.questionIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{stat.question}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {stat.wrongAnswers}/{stat.totalAttempts} wrong answers
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-3xl font-black ${colors.text}`}>{stat.errorRate}%</p>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Error Rate</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full ${stat.errorRate < 30 ? 'bg-green-500' : stat.errorRate < 60 ? 'bg-yellow-500' : 'bg-red-500'} transition-all`}
                                    style={{ width: `${stat.errorRate}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Modal */}
            {selectedQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedQuestion(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-black text-slate-800">Question {selectedQuestion.questionIndex + 1} Details</h4>
                            <button onClick={() => setSelectedQuestion(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl mb-4">
                            <p className="font-bold text-slate-700">{selectedQuestion.question}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                                <p className="text-2xl font-black text-blue-700">{selectedQuestion.totalAttempts}</p>
                                <p className="text-xs text-blue-600 font-bold uppercase">Total Attempts</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
                                <p className="text-2xl font-black text-red-700">{selectedQuestion.wrongAnswers}</p>
                                <p className="text-xs text-red-600 font-bold uppercase">Wrong Answers</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
                                <p className="text-2xl font-black text-green-700">{selectedQuestion.totalAttempts - selectedQuestion.wrongAnswers}</p>
                                <p className="text-xs text-green-600 font-bold uppercase">Correct</p>
                            </div>
                        </div>

                        {selectedQuestion.mostCommonWrongAnswer !== undefined && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <p className="font-bold text-orange-800 mb-2">⚠️ Most Common Mistake</p>
                                <p className="text-sm text-orange-700">
                                    Option {selectedQuestion.mostCommonWrongAnswer + 1} was chosen incorrectly {selectedQuestion.mostCommonWrongAnswerCount} times
                                </p>
                            </div>
                        )}

                        <button onClick={() => setSelectedQuestion(null)} className="w-full mt-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorHeatmap;
