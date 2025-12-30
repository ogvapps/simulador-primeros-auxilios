import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, RotateCcw, Brain, ArrowLeft } from 'lucide-react';

const FlashcardsGame = ({ glossary, onBack, playSound }) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [stats, setStats] = useState({ known: 0, learning: 0 });
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        // Shuffle glossary terms
        if (glossary && glossary.length > 0) {
            const shuffled = [...glossary].sort(() => Math.random() - 0.5);
            setCards(shuffled);
        }
    }, [glossary]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (!isFlipped) try { playSound('flip'); } catch (e) { }
    };

    const handleNext = (known) => {
        if (known) {
            setStats(prev => ({ ...prev, known: prev.known + 1 }));
            try { playSound('success'); } catch (e) { }
        } else {
            setStats(prev => ({ ...prev, learning: prev.learning + 1 }));
            try { playSound('error'); } catch (e) { }
        }

        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setFinished(true);
                try { playSound('fanfare'); } catch (e) { }
            }
        }, 150);
    };

    const handleRestart = () => {
        const shuffled = [...glossary].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setStats({ known: 0, learning: 0 });
        setFinished(false);
        setIsFlipped(false);
    };

    if (!cards.length) return <div>Cargando...</div>;

    if (finished) {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl text-center space-y-8 animate-in zoom-in">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Brain size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900">¡Sesión Completada!</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                        <p className="text-green-600 font-bold uppercase text-xs">Memorizado</p>
                        <p className="text-4xl font-black text-slate-800">{stats.known}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <p className="text-orange-600 font-bold uppercase text-xs">Por Repasar</p>
                        <p className="text-4xl font-black text-slate-800">{stats.learning}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onBack} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                        Volver
                    </button>
                    <button onClick={handleRestart} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={20} /> Repetir
                    </button>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="max-w-xl mx-auto space-y-6 h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft />
                </button>
                <div className="text-sm font-bold text-slate-400">
                    {currentIndex + 1} / {cards.length}
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Card Container - Perspective */}
            <div className="flex-1 perspective-1000 relative group cursor-pointer" onClick={handleFlip}>
                <div className={`relative w-full h-full transition-all duration-500 transform preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* Front */}
                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 backface-hidden">
                        <span className="text-indigo-500 font-black tracking-widest uppercase text-xs mb-4">Término</span>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-800 text-center leading-tight">
                            {currentCard.t}
                        </h3>
                        <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">Toca para voltear</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 bg-indigo-600 text-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180">
                        <span className="text-indigo-200 font-bold tracking-widest uppercase text-xs mb-4">Definición</span>
                        <p className="text-xl md:text-2xl font-bold text-center leading-relaxed">
                            {currentCard.d}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {isFlipped ? (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(false); }}
                        className="py-4 bg-orange-100 text-orange-600 rounded-2xl font-black hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <XCircle /> Repasar
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(true); }}
                        className="py-4 bg-green-100 text-green-600 rounded-2xl font-black hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 /> Lo sé
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleFlip}
                    className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> Voltear Tarjeta
                </button>
            )}
        </div>
    );
};

export default FlashcardsGame;
