import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, AlertTriangle, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { Button, Input, Card } from '../DesignSystem';
import { playSound } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';

export const AiSimulatorGame = ({ onBack, onComplete }: { onBack: () => void, onComplete: (xp: number) => void }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [topic, setTopic] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [ai, setAi] = useState<GoogleGenAI | null>(null);
    const [chatSession, setChatSession] = useState<any>(null);

    useEffect(() => {
        try {
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setAi(genAI);
        } catch (e) {
            console.error("Failed to init AI", e);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startSimulation = async (selectedTopic: string) => {
        setTopic(selectedTopic);
        setIsLoading(true);
        setMessages([]);

        try {
            if (!ai) throw new Error("AI not initialized");

            const systemPrompt = `
                Actúa como una víctima o testigo en una emergencia médica. El usuario es el socorrista.
                Escenario: ${selectedTopic}.
                Reglas:
                1. Sé breve y realista. Si estás inconsciente, no hables.
                2. Reacciona a lo que hace el usuario (Protocolo PAS: Proteger, Avisar, Socorrer).
                3. Si el usuario lo hace muy mal, empeora. Si lo hace bien, mejora.
                4. Cuando el usuario resuelva la situación o cometa un error fatal, escribe "[FIN]" seguido de una evaluación breve y una puntuación del 0 al 100.
                5. Empieza describiendo la situación inicial en primera persona o narrador.
            `;

            const model = "gemini-2.5-flash";
            const chat = ai.chats.create({
                model: model,
                config: {
                    systemInstruction: systemPrompt,
                },
            });
            setChatSession(chat);

            const result = await chat.sendMessage({ message: "¡Empieza la simulación!" });
            setMessages([{ role: 'model', text: result.text || "Error iniciando..." }]);
        } catch (e) {
            console.error(e);
            setMessages([{ role: 'model', text: "Error de conexión con la IA. Comprueba tu API Key." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !chatSession) return;
        
        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);
        playSound('click');

        try {
            const result = await chatSession.sendMessage({ message: userText });
            const aiText = result.text || "";
            setMessages(prev => [...prev, { role: 'model', text: aiText }]);
            playSound('click');

            if (aiText.includes("[FIN]")) {
                setIsFinished(true);
                playSound('fanfare');
                // Extract score roughly
                const match = aiText.match(/(\d+)\/100/);
                if (match) {
                    const score = parseInt(match[1]);
                    if (score > 50) onComplete(Math.round(score * 1.5)); // XP Reward
                } else {
                    onComplete(50);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    if (!topic) {
        const topics = [
            "Quemadura grave en cocina",
            "Ataque de ansiedad en examen",
            "Corte profundo con cristal",
            "Desmayo por calor",
            "Reacción alérgica a picadura",
            "Caída de bicicleta (casco roto)"
        ];

        return (
            <div className="max-w-2xl mx-auto p-6 animate-in fade-in">
                <Button variant="ghost" onClick={onBack} className="mb-4" leftIcon={<Bot/>}>Volver</Button>
                <Card className="text-center p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-xl">
                    <Bot size={64} className="mx-auto mb-4 text-indigo-200" />
                    <h2 className="text-3xl font-black mb-2">{t('aiSimTitle')}</h2>
                    <p className="text-indigo-100 mb-8">{t('aiSimDesc')}</p>
                    
                    <h3 className="text-left font-bold mb-4 text-indigo-200 uppercase text-xs tracking-wider">{t('topicSelect')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topics.map(t => (
                            <button 
                                key={t} 
                                onClick={() => startSimulation(t)}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left font-semibold transition-all border border-white/10 hover:border-white/30 active:scale-95"
                            >
                                {t}
                            </button>
                        ))}
                        <button 
                            onClick={() => startSimulation("Emergencia aleatoria sorpresa")}
                            className="p-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 rounded-xl font-bold shadow-lg md:col-span-2 flex items-center justify-center gap-2 transform transition-transform hover:-translate-y-1"
                        >
                            <AlertTriangle size={20} /> {t('topicRandom')}
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="bg-indigo-700 p-4 text-white flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full"><Bot size={24}/></div>
                    <div>
                        <h3 className="font-bold leading-tight">Simulador IA</h3>
                        <p className="text-xs text-indigo-200 truncate max-w-[200px]">{topic}</p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={onBack}>Salir</Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-gray-500 text-xs">
                            <Loader2 className="animate-spin" size={14}/> {t('aiTyping')}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
                {isFinished ? (
                    <Button fullWidth onClick={() => { setTopic(null); setIsFinished(false); }} variant="primary" leftIcon={<RefreshCw/>}>
                        Nueva Simulación
                    </Button>
                ) : (
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            placeholder="Describe tu acción (ej. Compruebo respiración...)" 
                            className="flex-1"
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()} variant="secondary">
                            <Send size={20} />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};