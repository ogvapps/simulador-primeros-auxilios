import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { Users, Plus, Trash2, Copy, Hash, GraduationCap, Loader2, Target, CheckCircle2, X } from 'lucide-react';
import { MODULES_ES } from '../../data/constants';

const ClassroomManager = ({ db, firebaseConfigId, t, addToast }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClassName, setNewClassName] = useState('');
    const [creating, setCreating] = useState(false);
    const [editingClass, setEditingClass] = useState(null); // For assigning tasks

    useEffect(() => {
        fetchClasses();
    }, [db, firebaseConfigId]);

    const fetchClasses = async () => {
        try {
            const collRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes');
            const snap = await getDocs(collRef);
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setClasses(list);
        } catch (e) {
            console.error(e);
            addToast && addToast("Error loading classes", "error");
        } finally {
            setLoading(false);
        }
    };

    const generateClassCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;
        setCreating(true);

        try {
            const code = generateClassCode();
            // TODO: Check if code exists (unlikely with 6 chars but possible)

            const newClass = {
                name: newClassName.trim(),
                code: code,
                createdAt: new Date().toISOString(),
                studentCount: 0
            };

            const collRef = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes');
            await addDoc(collRef, newClass);

            setNewClassName('');
            addToast && addToast("Clase creada con éxito", "success");
            fetchClasses();
        } catch (e) {
            console.error(e);
            addToast && addToast("Error creando clase", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteClass = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta clase? Los alumnos perderán la asignación.")) return;
        try {
            await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes', id));
            setClasses(classes.filter(c => c.id !== id));
            addToast && addToast("Clase eliminada", "success");
        } catch (e) {
            console.error(e);
            addToast && addToast("Error eliminando clase", "error");
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        addToast && addToast("Código copiado", "success");
    };

    const handleUpdateAssignment = async (clsId, moduleId) => {
        try {
            await updateDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'classes', clsId), {
                activeAssignment: moduleId ? { moduleId, type: 'recommended', setAt: new Date().toISOString() } : null
            });

            // Update local state
            setClasses(prev => prev.map(c => c.id === clsId ? {
                ...c,
                activeAssignment: moduleId ? { moduleId, type: 'recommended' } : null
            } : c));

            setEditingClass(null);
            addToast && addToast(moduleId ? "Tarea asignada correctamente" : "Asignación eliminada", "success");
        } catch (e) {
            console.error(e);
            addToast && addToast("Error actualizando tarea", "error");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-brand-600" /> Aulas Virtuales
                    </h2>
                    <p className="text-slate-500 mt-1">Crea códigos únicos para agrupar a tus alumnos.</p>
                </div>
            </div>

            {/* Create Form */}
            <form onSubmit={handleCreateClass} className="flex gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input
                    type="text"
                    placeholder="Nombre de la clase (ej. 5º Primaria A)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none font-bold text-slate-700"
                    disabled={creating}
                />
                <button
                    type="submit"
                    disabled={creating || !newClassName.trim()}
                    className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    {creating ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                    Crear Clase
                </button>
            </form>

            {/* Class List */}
            {loading ? (
                <div className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-brand-500 mb-2" size={32} />
                    <p className="text-slate-400 font-medium">Cargando aulas...</p>
                </div>
            ) : classes.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Users size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold mb-2">No tienes clases creadas</p>
                    <p className="text-sm text-slate-400">Crea tu primera clase arriba para generar un código.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-white rounded-xl border-2 border-slate-100 hover:border-brand-200 transition-all shadow-sm hover:shadow-md p-6 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
                                    <Users size={24} />
                                </div>
                                <button
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Eliminar clase"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <button
                                onClick={() => setEditingClass(cls)}
                                className={`w-full mb-4 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${cls.activeAssignment ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                            >
                                <Target size={16} />
                                {cls.activeAssignment ?
                                    (MODULES_ES.find(m => m.id === cls.activeAssignment.moduleId)?.title || 'Tarea asignada')
                                    : 'Asignar Tarea Prioritaria'
                                }
                            </button>

                            <h3 className="text-xl font-black text-slate-800 mb-2">{cls.name}</h3>

                            <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-between group/code cursor-pointer hover:bg-slate-200 transition-colors"
                                onClick={() => copyCode(cls.code)}>
                                <div className="flex items-center gap-2">
                                    <Hash size={16} className="text-slate-400" />
                                    <span className="font-mono font-bold text-lg text-slate-700 tracking-widest">{cls.code}</span>
                                </div>
                                <Copy size={16} className="text-slate-400 group-hover/code:text-brand-600" />
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-sm text-slate-500 font-medium">
                                <span>{cls.studentCount || 0} Alumnos</span>
                                <span>{new Date(cls.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assignment Modal */}
            {editingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Tarea Prioritaria</h3>
                                <p className="text-sm text-slate-500">Para: {editingClass.name}</p>
                            </div>
                            <button onClick={() => setEditingClass(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                            <button
                                onClick={() => handleUpdateAssignment(editingClass.id, null)}
                                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${!editingClass.activeAssignment ? 'border-slate-500 bg-slate-100' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!editingClass.activeAssignment ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-300'}`}>
                                    {!editingClass.activeAssignment && <CheckCircle2 size={14} />}
                                </div>
                                <span className="font-bold text-slate-700">Sin Asignación</span>
                            </button>

                            {MODULES_ES.map(mod => (
                                <button
                                    key={mod.id}
                                    onClick={() => handleUpdateAssignment(editingClass.id, mod.id)}
                                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${editingClass.activeAssignment?.moduleId === mod.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${editingClass.activeAssignment?.moduleId === mod.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`}>
                                        {editingClass.activeAssignment?.moduleId === mod.id && <CheckCircle2 size={14} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{mod.title}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{mod.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ClassroomManager;
