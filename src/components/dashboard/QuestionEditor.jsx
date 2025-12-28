import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { EXAM_QUESTIONS } from '../../data/constants';

const QuestionEditor = ({ db, firebaseConfigId, t, addToast, playSound }) => {
    const [questions, setQuestions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const docRef = doc(db, 'artifacts', firebaseConfigId, 'public', 'config');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().exam_questions) {
                setQuestions(docSnap.data().exam_questions);
            } else {
                // Use default questions from constants or empty array
                setQuestions(EXAM_QUESTIONS || []);
            }
        } catch (e) {
            console.error(e);
            setQuestions(EXAM_QUESTIONS || []);
        }
    };

    const saveQuestions = async () => {
        try {
            const docRef = doc(db, 'artifacts', firebaseConfigId, 'public', 'config');
            await setDoc(docRef, { exam_questions: questions }, { merge: true });
            if (playSound) playSound('success');
            addToast(t?.editor?.saved || "Questions saved!", 'success');
        } catch (e) {
            console.error(e);
            addToast("Error saving", 'error');
        }
    };

    const addQuestion = () => {
        if (!currentQuestion.question.trim() || currentQuestion.options.some(o => !o.trim())) {
            addToast("Fill all fields", 'warning');
            return;
        }

        if (editingIndex !== null) {
            const updated = [...questions];
            updated[editingIndex] = currentQuestion;
            setQuestions(updated);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, currentQuestion]);
        }

        setCurrentQuestion({ question: '', options: ['', '', '', ''], correctIndex: 0 });
    };

    const deleteQuestion = (index) => {
        if (confirm("Delete this question?")) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const editQuestion = (index) => {
        setCurrentQuestion(questions[index]);
        setEditingIndex(index);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">{t?.editor?.title || "Exam Editor"}</h3>
                <button onClick={saveQuestions} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg">
                    <Save size={20} /> {t?.editor?.save || "Save Exam"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question Form */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-lg mb-4 text-slate-700">{editingIndex !== null ? "Edit Question" : (t?.editor?.add || "New Question")}</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">{t?.editor?.question || "Question"}</label>
                            <textarea
                                value={currentQuestion.question}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                                rows="3"
                                placeholder="¿Qué significa P.A.S.?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">{t?.editor?.options || "Options"}</label>
                            {currentQuestion.options.map((opt, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={currentQuestion.correctIndex === i}
                                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctIndex: i })}
                                        className="mt-3"
                                    />
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...currentQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                        }}
                                        className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder={`Opción ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <button onClick={addQuestion} className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 flex items-center justify-center gap-2">
                            {editingIndex !== null ? <><CheckCircle size={20} /> Update</> : <><Plus size={20} /> Add Question</>}
                        </button>

                        {editingIndex !== null && (
                            <button onClick={() => { setEditingIndex(null); setCurrentQuestion({ question: '', options: ['', '', '', ''], correctIndex: 0 }); }} className="w-full py-2 text-slate-600 hover:text-slate-800 font-bold">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Questions List */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-h-[600px] overflow-y-auto">
                    <h4 className="font-bold text-lg mb-4 text-slate-700">Questions ({questions?.length || 0})</h4>
                    <div className="space-y-3">
                        {(!questions || questions.length === 0) ? (
                            <p className="text-center text-slate-400 py-8 italic">No questions yet. Add your first question!</p>
                        ) : (
                            questions.map((q, idx) => (
                                <div key={idx} className={`bg-white p-4 rounded-xl border ${editingIndex === idx ? 'border-brand-500 shadow-md' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-slate-800 text-sm flex-1">Q{idx + 1}: {q.question}</p>
                                        <div className="flex gap-1">
                                            <button onClick={() => editQuestion(idx)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => deleteQuestion(idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {q.options?.map((opt, i) => (
                                            <p key={i} className={`text-xs ${i === q.correctIndex ? 'text-green-600 font-bold' : 'text-slate-500'}`}>
                                                {i === q.correctIndex && '✓ '}{opt}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionEditor;
