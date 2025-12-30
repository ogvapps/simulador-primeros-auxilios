import React, { useState, useEffect } from 'react';
import { Save, Volume2, ShieldAlert, Award, GraduationCap, Globe } from 'lucide-react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const SettingsTab = ({ db, firebaseConfigId, t, addToast, playSound }) => {
    const [passingScore, setPassingScore] = useState(7);
    const [strictMode, setStrictMode] = useState(false);
    const [soundEffects, setSoundEffects] = useState(true);
    const [examSize, setExamSize] = useState(40);

    // Scope Management
    const [classes, setClasses] = useState([]);
    const [selectedScope, setSelectedScope] = useState('global'); // 'global' or classId
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await fetchClasses();
            await loadSettings('global');
        };
        init();
    }, []);

    const fetchClasses = async () => {
        try {
            const collRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes');
            const snap = await getDocs(collRef);
            setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error("Error loading classes for settings:", e);
        }
    };

    const loadSettings = async (scopeId) => {
        setLoading(true);
        try {
            let data = {};
            if (scopeId === 'global') {
                const docRef = doc(db, 'artifacts', firebaseConfigId, 'public', 'config');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) data = docSnap.data();
            } else {
                const docRef = doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes', scopeId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const classData = docSnap.data();
                    data = classData.settings || {}; // Class settings are nested
                }
            }

            // Set state (defaulting to global values or defaults if missing)
            // Note: For class specific, we might want to "inherit" visually, but for now we just show what's saved or default
            setPassingScore(data.passingScore !== undefined ? data.passingScore : 7);
            setStrictMode(data.strictMode !== undefined ? data.strictMode : false);
            setSoundEffects(data.soundEffects !== undefined ? data.soundEffects : true);
            setExamSize(data.examSize !== undefined ? data.examSize : 40);

        } catch (e) {
            console.error('Error loading settings:', e);
            addToast && addToast("Error loading settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleScopeChange = (e) => {
        const newScope = e.target.value;
        setSelectedScope(newScope);
        loadSettings(newScope);
    };

    const handleSave = async () => {
        try {
            const settingsObj = {
                passingScore,
                strictMode,
                soundEffects,
                examSize,
                updatedAt: new Date().toISOString()
            };

            if (selectedScope === 'global') {
                await setDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'config'), settingsObj, { merge: true });
            } else {
                // Save to class document under 'settings' field
                await setDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes', selectedScope), {
                    settings: settingsObj
                }, { merge: true });
            }

            if (playSound) playSound('success');
            addToast(t?.settings?.saved || "Settings saved successfully", 'success');
        } catch (e) {
            console.error(e);
            addToast("Error saving settings", 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-8 border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                    <ShieldAlert className="text-brand-500" /> {t?.settings?.title || "Configuración del Curso"}
                </h3>

                {/* Scope Selector */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ámbito de Configuración</label>
                    <div className="relative">
                        <select
                            value={selectedScope}
                            onChange={handleScopeChange}
                            className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="global">🌍 Configuración General (Global)</option>
                            <optgroup label="Aulas Específicas">
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>🎓 {c.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <div className="absolute left-3 top-3.5 text-slate-400 pointer-events-none">
                            {selectedScope === 'global' ? <Globe size={18} /> : <GraduationCap size={18} />}
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {selectedScope === 'global'
                            ? "Estos ajustes se aplicarán a todos los estudiantes que no pertenezcan a una clase con configuración específica."
                            : "Estos ajustes anularán la configuración global solo para los estudiantes de esta clase."}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-10 text-center text-slate-400">Cargando configuración...</div>
            ) : (
                <div className="space-y-8">
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 flex justify-between">
                            <span>{t?.settings?.passingScore || "Nota de Corte"}</span>
                            <span className="text-brand-600 text-xl">{passingScore}/10</span>
                        </label>
                        <input
                            type="range" min="5" max="10" step="0.5"
                            value={passingScore} onChange={(e) => setPassingScore(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                            <span>5 (Fácil)</span>
                            <span>10 (Difícil)</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-bold mb-2 flex justify-between">
                            <span>🧩 Preguntas por Examen</span>
                            <span className="text-purple-600 text-xl">{examSize}</span>
                        </label>
                        <input
                            type="range" min="5" max="60" step="5"
                            value={examSize} onChange={(e) => setExamSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                            <span>5 (Rápido)</span>
                            <span>60 (Completo)</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${strictMode ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{t?.settings?.strictMode || "Modo Estricto"}</p>
                                <p className="text-xs text-slate-500">{t?.settings?.strictDesc || "Limita intentos y penaliza fallos"}</p>
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
                                <p className="font-bold text-slate-800">{t?.settings?.soundEffects || "Efectos de Sonido"}</p>
                                <p className="text-xs text-slate-500">Sonidos globales del aula</p>
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
                        <Save size={24} /> {t?.settings?.save || "Guardar Cambios"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsTab;
