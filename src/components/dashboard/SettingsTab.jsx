import React, { useState, useEffect } from 'react';
import { Save, Volume2, ShieldAlert, Award } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SettingsTab = ({ db, firebaseConfigId, t, addToast, playSound }) => {
    const [passingScore, setPassingScore] = useState(7);
    const [strictMode, setStrictMode] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);
    const [examSize, setExamSize] = useState(40); // Default 40 questions
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const docRef = doc(db, 'artifacts', firebaseConfigId, 'public', 'config');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.passingScore !== undefined) setPassingScore(data.passingScore);
                if (data.strictMode !== undefined) setStrictMode(data.strictMode);
                if (data.soundEffects !== undefined) setSoundEffects(data.soundEffects);
                if (data.examSize !== undefined) setExamSize(data.examSize);
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await setDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'config'), {
                passingScore,
                strictMode,
                soundEffects,
                examSize,
                updatedAt: new Date().toISOString()
            }, { merge: true }); // IMPORTANT: merge to not overwrite exam_questions
            if (playSound) playSound('success');
            addToast(t?.settings?.saved || "Settings saved", 'success');
        } catch (e) {
            console.error(e);
            addToast("Error saving settings", 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <ShieldAlert className="text-brand-500" /> {t?.settings?.title || "Course Settings"}
            </h3>

            <div className="space-y-8">
                <div>
                    <label className="block text-slate-700 font-bold mb-2 flex justify-between">
                        <span>{t?.settings?.passingScore || "Passing Score"}</span>
                        <span className="text-brand-600 text-xl">{passingScore}/10</span>
                    </label>
                    <input
                        type="range" min="5" max="10" step="0.5"
                        value={passingScore} onChange={(e) => setPassingScore(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                        <span>5 (Easy)</span>
                        <span>10 (Hard)</span>
                    </div>
                </div>

                <div>
                    <label className="block text-slate-700 font-bold mb-2 flex justify-between">
                        <span>🧩 Questions per Exam</span>
                        <span className="text-purple-600 text-xl">{examSize}</span>
                    </label>
                    <input
                        type="range" min="5" max="60" step="5"
                        value={examSize} onChange={(e) => setExamSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                        <span>5 (Quick)</span>
                        <span>60 (Full)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">
                        Students get questions based on their role: 5ºP=20, 6ºP=30, ESO 1º-2º=40, ESO 3º=50, ESO 4º/Prof=60
                    </p>
                    <p className="text-xs text-slate-400 mt-1 italic">
                        ⚙️ Override: Set a custom value here to force all students to use the same count
                    </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${strictMode ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{t?.settings?.strictMode || "Strict Mode"}</p>
                            <p className="text-xs text-slate-500">{t?.settings?.strictDesc || "Limit attempts & penalize errors"}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setStrictMode(!strictMode)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${strictMode ? 'bg-red-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${strictMode ? 'left-8' : 'left-1'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${soundEffects ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                            <Volume2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{t?.settings?.soundEffects || "Sound Effects"}</p>
                            <p className="text-xs text-slate-500">Global Classroom Sounds</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSoundEffects(!soundEffects)}
                        className={`w-14 h-7 rounded-full transition-colors relative ${soundEffects ? 'bg-blue-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${soundEffects ? 'left-8' : 'left-1'}`} />
                    </button>
                </div>

                <button onClick={handleSave} className="w-full py-4 bg-brand-600 text-white rounded-xl font-black text-lg hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <Save size={24} /> {t?.settings?.save || "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
