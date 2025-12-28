import React from 'react';
import { Target, Download } from 'lucide-react';
import { generateStudentProgressPDF } from '../../utils/studentProgressPDF';

const StudentActions = ({ student, modules, onStartPractice, t }) => {
    const handleDownloadProgress = () => {
        generateStudentProgressPDF(student, modules);
    };

    return (
        <div className="flex gap-3 flex-wrap">
            {/* Practice Mode Button */}
            <button
                onClick={onStartPractice}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <Target size={20} />
                {t?.practice?.button || "🎯 Practice Mode"}
            </button>

            {/* Download Progress Button */}
            <button
                onClick={handleDownloadProgress}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <Download size={20} />
                {t?.progress?.download || "📊 Download Progress"}
            </button>
        </div>
    );
};

export default StudentActions;
