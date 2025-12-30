import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, HelpCircle, ChevronRight, Zap, Target, BookOpen, Skull, Flame, RefreshCcw, Brain, GalleryHorizontal } from 'lucide-react';
import FlashcardsGame from '../games/FlashcardsGame';

const PracticeMode = ({
    questions,
    onBack,
    onAnswer,
    onModeChange,
    playSound,
    addToast,
    failedQuestions = [],
    masteredQuestions = [],
    categories = [],
    glossary = []
}) => {
    const [mode, setMode] = useState('menu'); // 'menu', 'normal', 'survival', 'errorLab', 'category'

    const handleSetMode = (newMode) => {
        setMode(newMode);
        if (onModeChange) onModeChange(newMode);
    };
    const [activeCategory, setActiveCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [stats, setStats] = useState({ correct: 0, total: 0 });
    const [history, setHistory] = useState([]);
    const [streak, setStreak] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Filtered questions based on mode
    const filteredPool = useMemo(() => {
        if (mode === 'errorLab') {
            return questions.filter(q => failedQuestions.includes(q.q));
        }
        if (mode === 'category' && activeCategory) {
            return questions.filter(q => q.cat === activeCategory);
        }
        return questions;
    }, [mode, activeCategory, questions, failedQuestions]);

    const getNewQuestion = () => {
        if (filteredPool.length === 0) {
            setCurrentQuestion(null);
            return;
        }

        // Pick a random question not recently asked if possible
        let available = filteredPool.filter(q => !history.includes(q.q));
        if (available.length === 0) {
            setHistory([]);
            available = filteredPool;
        }

        const random = available[Math.floor(Math.random() * available.length)];
        setCurrentQuestion(random);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    useEffect(() => {
        if (mode !== 'menu') {
            getNewQuestion();
        }
    }, [mode, activeCategory]);

    const handleAnswer = (idx) => {
        if (isAnswered || gameOver) return;

        setSelectedOption(idx);
        setIsAnswered(true);
        setHistory(prev => [...prev, currentQuestion.q]);

        const isCorrect = currentQuestion.opts[idx] === currentQuestion.a;

        if (isCorrect) {
            const newCount = stats.correct + 1;
            const newStreak = streak + 1;
            setStreak(newStreak);
            setStats(prev => ({ ...prev, correct: newCount, total: prev.total + 1 }));
            try { playSound('success'); } catch (e) { }

            if (newStreak === 5) addToast('¡Racha de 5! 🔥', 'success');
            if (newStreak === 10) addToast('¡Racha de 10! 🚀', 'success');

            onAnswer(true, newCount, currentQuestion, newStreak);
        } else {
            setStreak(0);
            setStats(prev => ({ ...prev, total: prev.total + 1 }));
            try { playSound('error'); } catch (e) { }
            onAnswer(false, stats.correct, currentQuestion, 0);

            if (mode === 'survival') {
                setGameOver(true);
                try { playSound('gameover'); } catch (e) { }
            }
        }
    };

    const resetGame = () => {
        setStats({ correct: 0, total: 0 });
        setStreak(0);
        setHistory([]);
        setGameOver(false);
        getNewQuestion();
    };

    if (mode === 'flashcards') {
        return <FlashcardsGame glossary={glossary} onBack={() => handleSetMode('menu')} playSound={playSound} />;
    }

    if (mode === 'menu') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onBack} className="bg-white p-3 rounded-xl shadow-sm hover:scale-105 transition-all text-slate-500">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900">Modo Práctica Avanzada</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Normal Mode */}
                    <button
                        onClick={() => handleSetMode('normal')}
                        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-brand-500 transition-all text-left flex flex-col gap-4 group hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">Entrenamiento Libre</h3>
                            <p className="text-slate-500 text-sm font-medium">Practica todas las preguntas sin presión. Gana XP cada 20 aciertos.</p>
                        </div>
                    </button>

                    {/* Survival Mode */}
                    <button
                        onClick={() => handleSetMode('survival')}
                        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-rose-500 transition-all text-left flex flex-col gap-4 group hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            <Skull size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">Modo Supervivencia</h3>
                            <p className="text-slate-500 text-sm font-medium">¡Un error y estás fuera! Gana el doble de XP por respuesta correcta bajo presión.</p>
                        </div>
                    </button>

                    {/* Smart Review (formerly Error Lab) */}
                    <button
                        onClick={() => {
                            if (failedQuestions.length === 0) {
                                addToast('¡No tienes errores que repasar! Sigue así.', 'info');
                                return;
                            }
                            handleSetMode('errorLab');
                        }}
                        className={`bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 transition-all text-left flex flex-col gap-4 group hover:-translate-y-1 ${failedQuestions.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-500'}`}
                    >
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Brain size={32} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 mb-1">Repaso Inteligente</h3>
                                <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 rounded-lg">{failedQuestions.length}</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Algoritmo de repetición espaciada para corregir tus fallos.</p>
                        </div>
                    </button>

                    {/* Flashcards */}
                    <button
                        onClick={() => handleSetMode('flashcards')}
                        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:border-violet-500 transition-all text-left flex flex-col gap-4 group hover:-translate-y-1"
                    >
                        <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                            <GalleryHorizontal size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">Flashcards</h3>
                            <p className="text-slate-500 text-sm font-medium">Repaso rápido de términos clave con tarjetas de memoria.</p>
                        </div>
                    </button>

                    {/* Mastery / Categories */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col gap-6 md:col-span-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Maestría por Categorías</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categories.map(cat => {
                                const catQuestions = questions.filter(q => q.cat === cat.id);
                                const catMasteredCount = catQuestions.filter(q => masteredQuestions.includes(q.q)).length;
                                const isFullyMastered = catQuestions.length > 0 && catMasteredCount === catQuestions.length;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            handleSetMode('category');
                                        }}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group hover:-translate-y-1 ${isFullyMastered ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-brand-500 bg-slate-50'}`}
                                    >
                                        <div className={`text-2xl ${isFullyMastered ? 'animate-bounce' : ''}`}>
                                            {isFullyMastered ? '🏆' : '🎯'}
                                        </div>
                                        <span className="text-xs font-black text-center text-slate-700 leading-tight">
                                            {cat.name}
                                        </span>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                            <div
                                                className={`h-full ${isFullyMastered ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                                style={{ width: `${(catMasteredCount / Math.max(1, catQuestions.length)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {catMasteredCount}/{catQuestions.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="max-w-2xl mx-auto p-12 bg-white rounded-3xl shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Skull size={48} />
                </div>
                <h2 className="text-4xl font-black text-slate-900">¡FIN DEL JUEGO!</h2>
                <div className="space-y-2">
                    <p className="text-slate-500 font-bold text-lg uppercase tracking-widest">Racha Final</p>
                    <div className="text-6xl font-black text-rose-600">{stats.correct}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 text-left">
                    <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-tighter">Te falló esta pregunta:</p>
                    <p className="text-slate-700 font-black mb-4">{currentQuestion.q}</p>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <p className="text-emerald-700 font-bold text-sm">Respuesta correcta: <span className="font-black">{currentQuestion.a}</span></p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSetMode('menu')}
                        className="flex-1 bg-slate-200 text-slate-700 font-black py-4 rounded-2xl hover:bg-slate-300 transition-all"
                    >
                        Salir
                    </button>
                    <button
                        onClick={resetGame}
                        className="flex-1 bg-rose-600 text-white font-black py-4 rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="max-w-xl mx-auto text-center space-y-6 pt-20">
                <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">¡Felicidades!</h2>
                <p className="text-slate-500 font-medium">Has completado todas las preguntas en este modo.</p>
                <button onClick={() => handleSetMode('menu')} className="bg-brand-600 text-white font-black px-8 py-3 rounded-xl">
                    Volver al Menú
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <button
                    onClick={() => handleSetMode('menu')}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Menú</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">{mode === 'survival' ? 'MODO SUPERVIVENCIA' : mode === 'errorLab' ? 'LABORATORIO' : 'PRÁCTICA'}</span>
                    {streak >= 1 && (
                        <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-black flex items-center gap-1 animate-bounce">
                            <Flame size={14} fill="currentColor" /> {streak}
                        </div>
                    )}
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black flex items-center gap-1">
                        <CheckCircle2 size={14} /> {stats.correct}
                    </div>
                    {mode === 'survival' && (
                        <div className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-black flex items-center gap-1">
                            <Zap size={14} fill="currentColor" /> x2 XP
                        </div>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
                <div className="bg-brand-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <HelpCircle size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-2 py-0.5 rounded-full">
                            {categories.find(c => c.id === currentQuestion.cat)?.name || 'General'}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight relative z-10">
                        {currentQuestion.q}
                    </h2>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                    {currentQuestion.opts.map((opt, idx) => {
                        const isCorrect = opt === currentQuestion.a;
                        const isSelected = selectedOption === idx;

                        let stateStyles = "border-slate-100 hover:border-brand-200 hover:bg-brand-50";
                        if (isAnswered) {
                            if (isCorrect) stateStyles = "border-green-500 bg-green-50 ring-2 ring-green-200";
                            else if (isSelected) stateStyles = "border-red-500 bg-red-50 ring-2 ring-red-200";
                            else stateStyles = "opacity-50 border-slate-100";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isAnswered}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${stateStyles}`}
                            >
                                <span className={`text-lg font-bold ${isSelected || (isAnswered && isCorrect) ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {opt}
                                </span>
                                {isAnswered && isCorrect && <CheckCircle2 className="text-green-500 shrink-0" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" />}
                                {!isAnswered && <ChevronRight className="text-slate-300 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className={`p-6 md:p-8 border-t-2 animate-in slide-in-from-bottom-4 duration-300 ${currentQuestion.opts[selectedOption] === currentQuestion.a ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'
                        }`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl shadow-sm ${currentQuestion.opts[selectedOption] === currentQuestion.a ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                {currentQuestion.opts[selectedOption] === currentQuestion.a ? <Zap size={24} /> : <HelpCircle size={24} />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-lg font-black mb-1 ${currentQuestion.opts[selectedOption] === currentQuestion.a ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {currentQuestion.opts[selectedOption] === currentQuestion.a ? '¡Excelente!' : 'Para la próxima...'}
                                </h4>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {currentQuestion.expl}
                                </p>
                            </div>
                        </div>

                        {!gameOver && (
                            <button
                                onClick={getNewQuestion}
                                className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Siguiente Pregunta
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Hint & Progress (Only in Normal/Category/ErrorLab) */}
            {mode !== 'survival' && (
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-6 rounded-3xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stats.correct >= 20 ? 'bg-emerald-500 text-white' : 'bg-brand-100 text-brand-600'}`}>
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white">Progreso de Recompensa</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    {stats.correct >= 20 ? '¡XP Activada!' : 'Mínimo 20 aciertos para ganar XP'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-brand-600">{stats.correct}</span>
                            <span className="text-slate-400 font-bold">/20</span>
                        </div>
                    </div>

                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 mb-4">
                        <div
                            className={`h-full transition-all duration-500 ${stats.correct >= 20 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                            style={{ width: `${Math.min((stats.correct / 20) * 100, 100)}%` }}
                        ></div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        {stats.correct < 20
                            ? `Te faltan ${20 - stats.correct} respuestas correctas para empezar a ganar XP. ¡Sigue así!`
                            : '¡Excelente! Ahora cada respuesta correcta te otorga +5 XP directamente.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PracticeMode;
