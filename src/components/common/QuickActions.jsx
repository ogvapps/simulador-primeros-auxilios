import React from 'react';
import { ShoppingBag, Target, Download, User } from 'lucide-react';
import { generateStudentProgressPDF } from '../../utils/studentProgressPDF';

const QuickActions = ({ student, modules, onStartPractice, onOpenStore, onOpenProfile, t }) => {
    const handleDownloadProgress = () => {
        generateStudentProgressPDF(student, modules);
    };

    return (
        <div className="flex gap-3 flex-wrap justify-center">
            {/* Store Button */}
            <button
                onClick={onOpenStore}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <ShoppingBag size={20} />
                {t?.store?.button || "🎁 Rewards Store"}
            </button>

            {/* Practice Mode Button */}
            <button
                onClick={onStartPractice}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <Target size={20} />
                {t?.practice?.button || "🎯 Practice Mode"}
            </button>

            {/* Download Progress Button */}
            <button
                onClick={handleDownloadProgress}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <Download size={20} />
                {t?.progress?.download || "📊 My Progress"}
            </button>

            {/* Profile/Backpack Button */}
            <button
                onClick={onOpenProfile}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
                <User size={20} />
                {t?.profile?.backpack_btn || "🎒 My Backpack"}
            </button>
        </div>
    );
};

export default QuickActions;
