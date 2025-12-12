import React, { memo, useState, useMemo, useEffect } from 'react';
import { 
    CheckCircle2, Lock, BookOpen, ArrowLeft, ArrowRight, Activity, Gamepad2, PlayCircle, Zap, Map, Layers, ChevronRight, Crown, Medal, Radar, MapPin, Users, Bot, Swords, User, List, FileText, Monitor
} from 'lucide-react';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { db, appId, isMock } from '../../firebaseConfig';
import { ICON_MAP, LEARNING_MODULE_IDS, MISSION_TITLES, MODULES } from '../../constants';
import { useGame } from '../../contexts/GameContext';
import { Module, GeoTarget } from '../../types';
import { Card, Badge, Button } from '../DesignSystem';
import { RadarGame } from '../games/RadarGame';
import { playSound } from '../../utils';
import { useLanguage } from '../../contexts/LanguageContext';

// MAPPING FOR BODY VIEW
const BODY_MAPPING: Record<string, { labelKey: string, ids: string[] }> = {
    head: { labelKey: 'bodyHead', ids: ['craneo', 'sincope', 'bucodental', 'epilepsia', 'ansiedad', 'sim_comedor'] }, 
    chest: { labelKey: 'bodyChest', ids: ['rcp', 'atragantamiento', 'asma', 'anafilaxia'] },
    limbs: { labelKey: 'bodyLimbs', ids: ['hemorragia', 'quemaduras', 'golpes'] },
    general: { labelKey: 'bodyGeneral', ids: ['pas', 'pls', 'diabetes', 'botiquin', 'triaje', 'sim_patio'] }
};

export const ModuleCard = memo(({ module, onClick }: { module: Module, onClick: () => void }) => {
  const { progress } = useGame();
  const allModulesDone = LEARNING_MODULE_IDS.every(id => progress[`${id}Completed`]);
  const examPassed = progress.examenPassed;
  
  let isLocked = false;
  let statusLabel = "Disponible";
  let statusVariant: 'info' | 'success' | 'warning' | 'purple' = 'info';

  if (module.type === 'exam') {
    isLocked = !allModulesDone;
    statusLabel = isLocked ? "Bloqueado" : "Examen Final";
    statusVariant = isLocked ? 'info' : 'purple';
  } else if (module.type === 'certificate' || module.type === 'desa') {
    isLocked = !examPassed;
    statusLabel = isLocked ? "Bloqueado" : "Desbloqueado";
    statusVariant = 'warning';
  } else if (module.type === 'roleplay') {
      statusLabel = "Simulación";
      statusVariant = 'purple';
  } else if (module.type === 'flashcards') {
      statusLabel = "Repaso";
      statusVariant = 'success';
  }

  const isCompleted = (module.type === 'module' || module.type === 'roleplay' || module.type === 'flashcards') && progress[`${module.id}Completed`];
  if (isCompleted) {
      statusLabel = "Completado";
      statusVariant = 'success';
  }

  return (
    <button 
      onClick={onClick} 
      disabled={isLocked} 
      className="w-full text-left h-full"
    >
        <Card hoverEffect={!isLocked} className={`h-full flex flex-col overflow-hidden relative ${isLocked ? 'opacity-75 grayscale bg-gray-50 cursor-not-allowed' : ''}`}>
            {/* Status Bar */}
            <div className={`h-1.5 w-full absolute top-0 left-0 ${
                isLocked ? 'bg-gray-300' : 
                statusVariant === 'success' ? 'bg-green-500' :
                statusVariant === 'warning' ? 'bg-yellow-500' :
                statusVariant === 'purple' ? 'bg-indigo-600' :
                'bg-blue-500'
            }`} />

            <div className="flex justify-between items-start mb-4 pt-2">
                <div className={`p-3 rounded-xl transition-transform duration-300 ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-50 text-gray-700 group-hover:scale-110'}`}>
                    {React.cloneElement((ICON_MAP[module.icon] as React.ReactElement) || <BookOpen />, { size: 28 })}
                </div>
                {isCompleted ? <CheckCircle2 size={24} className="text-green-500" /> : isLocked && <Lock size={24} className="text-gray-400" />}
            </div>

            <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
                {module.title}
            </h3>
            
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                {module.description}
            </p>

            <div className="mt-auto pt-3 border-t border-gray-100 w-full flex justify-between items-center">
                <Badge variant={isLocked ? 'default' : statusVariant}>{statusLabel}</Badge>
                {!isCompleted && !isLocked && module.type !== 'flashcards' && (
                    <span className="text-xs font-bold text-yellow-600 flex items-center">
                        +50 XP
                    </span>
                )}
            </div>
        </Card>
    </button>
  );
});

export const BodyMapView = memo(({ onModuleClick }: { onModuleClick: (m: Module) => void }) => {
    // ... same code as before ...
    const { t } = useLanguage();
    const [selectedPart, setSelectedPart] = useState<string>('general');

    const activeModules = useMemo(() => {
        const ids = BODY_MAPPING[selectedPart]?.ids || [];
        return MODULES.filter(m => ids.includes(m.id));
    }, [selectedPart]);

    const handlePartClick = (part: string) => {
        playSound('click');
        setSelectedPart(part);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Interactive Body SVG */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="relative h-[450px] w-full max-w-[300px]">
                    <svg viewBox="0 0 200 450" className="w-full h-full drop-shadow-xl filter">
                        {/* Glow effect for selected part */}
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* General / Background Aura */}
                        <path 
                            d="M100 440 C160 440 180 300 180 200 C180 100 160 10 100 10 C40 10 20 100 20 200 C20 300 40 440 100 440" 
                            fill={selectedPart === 'general' ? '#e0f2fe' : 'transparent'} 
                            className="transition-colors duration-500"
                        />

                        {/* HEAD */}
                        <g onClick={() => handlePartClick('head')} className="cursor-pointer group">
                             <circle cx="100" cy="50" r="35" 
                                className={`transition-all duration-300 ${selectedPart === 'head' ? 'fill-indigo-500 stroke-indigo-600 stroke-4' : 'fill-gray-200 hover:fill-indigo-200 stroke-gray-300'}`} 
                             />
                             <text x="100" y="55" textAnchor="middle" className={`text-[10px] font-bold pointer-events-none ${selectedPart === 'head' ? 'fill-white' : 'fill-gray-500'}`}>CEREBRO</text>
                        </g>

                        {/* CHEST */}
                        <g onClick={() => handlePartClick('chest')} className="cursor-pointer group">
                             <path d="M65 90 Q100 100 135 90 L135 180 Q100 190 65 180 Z" 
                                className={`transition-all duration-300 ${selectedPart === 'chest' ? 'fill-red-500 stroke-red-600 stroke-4' : 'fill-gray-200 hover:fill-red-200 stroke-gray-300'}`}
                             />
                             <text x="100" y="140" textAnchor="middle" className={`text-[10px] font-bold pointer-events-none ${selectedPart === 'chest' ? 'fill-white' : 'fill-gray-500'}`}>TÓRAX</text>
                        </g>

                        {/* LIMBS */}
                        <g onClick={() => handlePartClick('limbs')} className="cursor-pointer group">
                             {/* Left Arm */}
                             <rect x="30" y="90" width="30" height="120" rx="10" 
                                className={`transition-all duration-300 ${selectedPart === 'limbs' ? 'fill-orange-400 stroke-orange-600 stroke-4' : 'fill-gray-200 hover:fill-orange-200 stroke-gray-300'}`}
                             />
                             {/* Right Arm */}
                             <rect x="140" y="90" width="30" height="120" rx="10" 
                                className={`transition-all duration-300 ${selectedPart === 'limbs' ? 'fill-orange-400 stroke-orange-600 stroke-4' : 'fill-gray-200 hover:fill-orange-200 stroke-gray-300'}`}
                             />
                             {/* Legs */}
                             <path d="M70 190 L70 380 Q85 400 100 380 L100 190 Z" 
                                className={`transition-all duration-300 ${selectedPart === 'limbs' ? 'fill-orange-400 stroke-orange-600 stroke-4' : 'fill-gray-200 hover:fill-orange-200 stroke-gray-300'}`}
                             />
                             <path d="M105 190 L105 380 Q120 400 135 380 L135 190 Z" 
                                className={`transition-all duration-300 ${selectedPart === 'limbs' ? 'fill-orange-400 stroke-orange-600 stroke-4' : 'fill-gray-200 hover:fill-orange-200 stroke-gray-300'}`}
                             />
                        </g>
                    </svg>

                    {/* Floating Labels */}
                    <div className="absolute bottom-0 w-full flex justify-center">
                        <button 
                            onClick={() => handlePartClick('general')}
                            className={`px-4 py-2 rounded-full font-bold shadow-lg transform transition-all ${selectedPart === 'general' ? 'bg-blue-600 text-white scale-110' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                        >
                            {t('bodyGeneral')}
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 animate-pulse">{t('selectBodyPart')}</p>
            </div>

            {/* Modules List for Selected Part */}
            <div className="w-full md:w-1/2">
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white uppercase">
                        {t(BODY_MAPPING[selectedPart]?.labelKey as any)}
                    </h3>
                    <div className="h-1 w-20 bg-red-500 rounded-full mt-2"></div>
                </div>

                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-20">
                    {activeModules.map(m => (
                        <ModuleCard key={m.id} module={m} onClick={() => onModuleClick(m)} />
                    ))}
                    {activeModules.length === 0 && (
                        <p className="text-gray-400 text-center py-8">No hay módulos específicos para esta zona.</p>
                    )}
                </div>
            </div>
        </div>
    );
});

export const LeaderboardView = memo(() => {
    // ... same code ...
    const { user } = useGame();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isMock) {
            setLeaders([
                { id: '1', name: 'Ana Pérez', progress: { xp: 2450, level: 5 } },
                { id: '2', name: 'Carlos R.', progress: { xp: 1890, level: 5 } },
                { id: '3', name: 'Elena M.', progress: { xp: 1200, level: 4 } },
                { id: '4', name: 'Tú', progress: { xp: 850, level: 4 }, isMe: true },
                { id: '5', name: 'David B.', progress: { xp: 600, level: 3 } },
            ]);
            setLoading(false);
            return;
        }

        getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'user_summaries')).then(snap => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data(), isMe: d.id === user.uid }));
            data.sort((a: any, b: any) => (b.progress?.xp || 0) - (a.progress?.xp || 0));
            setLeaders(data.slice(0, 50)); 
            setLoading(false);
        });
    }, [user.uid]);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando clasificación...</div>;

    return (
        <div className="space-y-4">
             <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center"><Crown className="mr-3" size={32}/> Tabla de Clasificación</h2>
                <p className="text-yellow-100">Los mejores socorristas de la escuela.</p>
            </div>

            <Card padding="none" className="overflow-hidden">
                <div className="lg:grid lg:grid-cols-2 lg:gap-0">
                    {leaders.map((u, index) => {
                        let rankIcon = <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>;
                        let rowBg = "bg-white";

                        if (index === 0) { rankIcon = <Crown size={24} className="text-yellow-500 fill-yellow-500"/>; rowBg = "bg-yellow-50"; }
                        else if (index === 1) { rankIcon = <Medal size={24} className="text-gray-400 fill-gray-400"/>; }
                        else if (index === 2) { rankIcon = <Medal size={24} className="text-amber-700 fill-amber-700"/>; }

                        if (u.isMe) rowBg = "bg-blue-50 border-l-4 border-blue-500";

                        return (
                            <div key={u.id} className={`flex items-center p-4 border-b border-gray-100 last:border-0 ${rowBg}`}>
                                <div className="mr-4 w-8 flex justify-center">{rankIcon}</div>
                                <div className="flex-1">
                                    <h3 className={`font-bold ${u.isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {u.name} {u.isMe && '(Tú)'}
                                    </h3>
                                    <p className="text-xs text-gray-500">Nivel {u.progress?.level || 1}</p>
                                </div>
                                <Badge variant="default" className="font-mono">{u.progress?.xp || 0} XP</Badge>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
});

export const TrainingView = memo(({ onModuleClick }: { onModuleClick: (m: any) => void }) => {
    const { t } = useLanguage();
    const [customScenarios, setCustomScenarios] = useState<any[]>([]);

    useEffect(() => {
        // Load custom scenarios
        if(isMock) {
            const saved = localStorage.getItem('custom_scenarios');
            if(saved) setCustomScenarios(JSON.parse(saved));
        } else {
            getDoc(doc(db, 'artifacts', appId, 'public', 'custom_scenarios')).then(snap => {
                if(snap.exists()) setCustomScenarios(snap.data().scenarios || []);
            });
        }
    }, []);

    const gameModules = useMemo(() => {
        return MODULES.filter(m => 
            m.type === 'roleplay' || 
            m.type === 'desa' || 
            m.type === 'pair_game' ||
            m.content?.steps.some(s => s.interactiveComponent)
        );
    }, []);

    // Helper to trigger special modes
    const triggerMode = (mode: string) => {
        onModuleClick({ type: mode });
    };

    return (
        <div className="p-2 space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center"><Gamepad2 className="mr-3" size={32}/> Zona de Entrenamiento</h2>
                <p className="text-blue-100">Practica tus habilidades con minijuegos rápidos y simulaciones.</p>
            </div>

            {/* Featured New Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button onClick={() => triggerMode('ai_sim')} className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl text-white text-left shadow-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                        <Bot size={128} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold flex items-center mb-2"><Bot className="mr-2"/> {t('aiSimTitle')}</h3>
                        <p className="text-indigo-100 text-sm">{t('aiSimDesc')}</p>
                        <div className="mt-4 bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            NUEVO
                        </div>
                    </div>
                </button>

                <button onClick={() => triggerMode('battle_player')} className="bg-gradient-to-r from-orange-600 to-yellow-600 p-6 rounded-2xl text-white text-left shadow-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                        <Monitor size={128} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold flex items-center mb-2"><Monitor className="mr-2"/> {t('battleMode')}</h3>
                        <p className="text-yellow-100 text-sm">{t('battleDesc')}</p>
                        <div className="mt-4 bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            EN VIVO
                        </div>
                    </div>
                </button>

                <button onClick={() => triggerMode('duel_game')} className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-2xl text-white text-left shadow-lg relative overflow-hidden group md:col-span-2">
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                        <Swords size={128} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold flex items-center mb-2"><Swords className="mr-2"/> {t('duelTitle')}</h3>
                        <p className="text-red-100 text-sm">{t('duelDesc')}</p>
                        <div className="mt-4 bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            MULTIJUGADOR
                        </div>
                    </div>
                </button>
            </div>

            {customScenarios.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{t('customScenarios')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customScenarios.map((scenario: any) => (
                            <button 
                                key={scenario.id} 
                                onClick={() => onModuleClick({ ...scenario, type: 'custom_roleplay' })} // pass full object
                                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 flex items-center hover:shadow-md transition-all text-left"
                            >
                                <div className="bg-indigo-50 p-3 rounded-full mr-4 text-indigo-600">
                                    <FileText size={24}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{scenario.title}</h3>
                                    <p className="text-xs text-gray-500 truncate">{scenario.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gameModules.map(m => {
                    let subLabel = "Minijuego";
                    let icon = <PlayCircle size={24} className="text-blue-500"/>;
                    let variant = "default";
                    
                    if (m.type === 'roleplay') { subLabel = "Simulación"; icon = <Activity size={24} className="text-violet-500"/>; variant = "purple"; }
                    else if (m.type === 'desa') { subLabel = "Simulador Externo"; icon = <Zap size={24} className="text-yellow-500"/>; variant = "warning"; }
                    else if (m.type === 'pair_game') { subLabel = "Roleplay en Parejas"; icon = <Users size={24} className="text-pink-600"/>; variant = "purple"; }

                    return (
                        <button 
                            key={m.id} 
                            onClick={() => onModuleClick(m)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-all active:scale-95 text-left group"
                        >
                            <div className="bg-gray-50 p-3 rounded-full mr-4 group-hover:bg-gray-100 transition-colors">
                                {icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{m.title}</h3>
                                <Badge variant={variant as any} size="sm">{subLabel}</Badge>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                <ArrowRight size={20}/>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

// ... MissionGroup and LearningMap components remain unchanged ...
// Since I need to return the full file content, I will include them below.

interface MissionGroupProps {
  groupIndex: number;
  modules: Module[];
  onModuleClick: (m: Module) => void;
}

const MissionGroup: React.FC<MissionGroupProps> = ({ groupIndex, modules, onModuleClick }) => {
    const { progress } = useGame();
    const nodeHeight = 160;
    const containerHeight = modules.length * nodeHeight + 80; 

    const mapConfig = useMemo(() => {
        return modules.map((m, i) => {
            const y = i * nodeHeight + 80;
            const allModulesDone = LEARNING_MODULE_IDS.every(id => progress[`${id}Completed`]);
            const examPassed = progress.examenPassed;
            let isLocked = false;
            let status: 'locked' | 'current' | 'completed' | 'available' = 'available';

            if (m.type === 'exam') {
                isLocked = !allModulesDone;
            } else if (m.type === 'certificate' || m.type === 'desa') {
                isLocked = !examPassed;
            }
            
            const isCompleted = (m.type === 'module' || m.type === 'roleplay' || m.type === 'flashcards') && progress[`${m.id}Completed`];
            const isExamPassed = (m.type === 'exam') && progress.examenPassed;

            if (isCompleted || isExamPassed) status = 'completed';
            else if (isLocked) status = 'locked';
            else status = 'current';

            return { ...m, y, status, isLocked };
        });
    }, [modules, progress]);

    const missionCompleted = mapConfig.every(m => m.status === 'completed');

    return (
        <div className={`relative max-w-md mx-auto rounded-3xl bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-500 pb-20`} style={{ height: containerHeight }}>
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gray-200 -translate-x-1/2 rounded-full" />
            
            <div className="absolute top-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-red-500 transition-all duration-1000" 
                 style={{ 
                     height: `${Math.max(0, (mapConfig.findIndex(m => m.status === 'current') !== -1 ? mapConfig.findIndex(m => m.status === 'current') : (missionCompleted ? mapConfig.length : 0)) * nodeHeight + 80)}px` 
                 }} 
            />

            {mapConfig.map((node, i) => {
                 let iconClass = "text-white"; 
                 if (node.status === 'locked') iconClass = "text-gray-400";
                 else if (node.status === 'completed') iconClass = "text-yellow-800";

                 return (
                    <div 
                        key={node.id}
                        className="absolute w-full flex justify-center flex-col items-center"
                        style={{ top: `${node.y}px`, transform: 'translateY(-50%)' }}
                    >
                        <div 
                            onClick={() => !node.isLocked && onModuleClick(node)}
                            className={`
                                relative z-10 w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 cursor-pointer shadow-lg
                                ${node.status === 'locked' ? 'bg-gray-100 border-gray-300' : 
                                  node.status === 'completed' ? 'bg-yellow-400 border-yellow-500 scale-100' : 
                                  'bg-red-500 border-red-600 scale-110 animate-bounce-subtle ring-4 ring-red-200'}
                            `}
                        >
                            {node.status === 'completed' && (
                                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                    <CheckCircle2 size={16} strokeWidth={3} />
                                </div>
                            )}
                            
                            {node.status === 'locked' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                                    <Lock size={24} className="text-gray-500" />
                                </div>
                            )}

                             {React.cloneElement((ICON_MAP[node.icon] as React.ReactElement) || <BookOpen />, { 
                                 size: 36,
                                 className: iconClass,
                                 strokeWidth: 2
                             })}
                        </div>
                        
                        <div className={`
                            mt-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-center max-w-[200px] z-20
                            ${node.isLocked ? 'opacity-70' : ''}
                        `}>
                            <p className={`text-sm font-bold leading-tight ${node.isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                                {node.title}
                            </p>
                        </div>
                    </div>
                 );
            })}
        </div>
    );
};

export const LearningMap = memo(({ onModuleClick }: { onModuleClick: (m: Module) => void }) => {
    const { progress, playSound } = useGame();
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState<'path' | 'body'>('path');
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
    const [showRadar, setShowRadar] = useState(false);
    const [geoTargets, setGeoTargets] = useState<GeoTarget[]>([]);
    
    // Modal states
    const [showLocationPrompt, setShowLocationPrompt] = useState(false);
    const [selectedModuleForLocation, setSelectedModuleForLocation] = useState<Module | null>(null);

    useEffect(() => {
        // Load Geo Targets
        if (isMock) {
            const savedGeo = localStorage.getItem('pas_geo_targets');
            if (savedGeo) setGeoTargets(JSON.parse(savedGeo));
        } else {
            getDoc(doc(db, 'artifacts', appId, 'public', 'geo_targets')).then(snap => {
                if (snap.exists()) setGeoTargets(snap.data().targets || []);
            });
        }
    }, []);

    const groupedModules = useMemo(() => {
        const size = 5;
        const chunks: Module[][] = [];
        for (let i = 0; i < MODULES.length; i += size) {
            chunks.push(MODULES.slice(i, i + size));
        }
        return chunks;
    }, []);

    const handleMissionClick = (index: number) => {
        playSound('click');
        setSelectedGroupIndex(index);
    };

    const handleModuleSelect = (m: Module) => {
        const hasGeo = geoTargets.some(t => t.id === m.id && t.active);
        if (hasGeo) {
            setSelectedModuleForLocation(m);
            setShowLocationPrompt(true);
            playSound('click');
        } else {
            onModuleClick(m);
        }
    };

    const handleUnlockMission = (moduleId: string) => {
        const module = MODULES.find(m => m.id === moduleId);
        if (module) {
            setShowRadar(false);
            setSelectedModuleForLocation(null);
            onModuleClick(module);
        }
    };

    if (showRadar) {
        const activeRadarTargets = selectedModuleForLocation 
            ? geoTargets.filter(t => t.id === selectedModuleForLocation.id) 
            : geoTargets;

        return (
            <RadarGame 
                targets={activeRadarTargets} 
                onUnlock={handleUnlockMission} 
                onExit={() => { setShowRadar(false); setSelectedModuleForLocation(null); }} 
            />
        );
    }

    if (viewMode === 'body') {
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <Button variant="outline" size="sm" onClick={() => { playSound('click'); setViewMode('path'); }} leftIcon={<List size={18}/>}>
                        {t('viewPath')}
                    </Button>
                 </div>
                 <BodyMapView onModuleClick={handleModuleSelect} />
                 {/* Geoloc Prompt for Body View clicks too */}
                 {showLocationPrompt && selectedModuleForLocation && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLocationPrompt(false)}>
                        <Card className="max-w-sm w-full animate-in zoom-in-95" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <div className="text-center mb-6">
                                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-600 animate-pulse">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Misión Geolocalizada</h3>
                                <p className="text-gray-600 text-sm">
                                    Esta misión se encuentra en una ubicación física real. 
                                    ¿Quieres usar el <strong>Radar GPS</strong> para encontrarla?
                                </p>
                            </div>
                            <div className="space-y-3">
                                <Button 
                                    fullWidth 
                                    variant="primary" 
                                    onClick={() => {
                                        setShowLocationPrompt(false);
                                        setShowRadar(true);
                                        playSound('click');
                                    }}
                                    leftIcon={<Radar size={20} className="animate-spin-slow" />}
                                >
                                    Activar Radar
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="ghost" 
                                    onClick={() => {
                                        setShowLocationPrompt(false);
                                        onModuleClick(selectedModuleForLocation);
                                        setSelectedModuleForLocation(null);
                                    }}
                                >
                                    No, jugar en pantalla
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    if (selectedGroupIndex !== null) {
        const group = groupedModules[selectedGroupIndex];
        const missionTitle = MISSION_TITLES[selectedGroupIndex] || `Misión ${selectedGroupIndex + 1}`;
        
        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
                <div className="w-full max-w-lg mx-auto mb-6">
                    <Button variant="outline" onClick={() => { playSound('click'); setSelectedGroupIndex(null); }} leftIcon={<ArrowLeft size={20}/>}>
                        Volver a Misiones
                    </Button>
                </div>
                
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">{missionTitle}</h2>
                    <p className="text-gray-500 text-sm">Camino de Aprendizaje</p>
                </div>

                <MissionGroup 
                    groupIndex={selectedGroupIndex} 
                    modules={group} 
                    onModuleClick={handleModuleSelect}
                />

                {/* Geolocation Prompt Modal */}
                {showLocationPrompt && selectedModuleForLocation && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowLocationPrompt(false)}>
                        <Card className="max-w-sm w-full animate-in zoom-in-95" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <div className="text-center mb-6">
                                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-green-600 animate-pulse">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Misión Geolocalizada</h3>
                                <p className="text-gray-600 text-sm">
                                    Esta misión se encuentra en una ubicación física real. 
                                    ¿Quieres usar el <strong>Radar GPS</strong> para encontrarla?
                                </p>
                            </div>
                            <div className="space-y-3">
                                <Button 
                                    fullWidth 
                                    variant="primary" 
                                    onClick={() => {
                                        setShowLocationPrompt(false);
                                        setShowRadar(true);
                                        playSound('click');
                                    }}
                                    leftIcon={<Radar size={20} className="animate-spin-slow" />}
                                >
                                    Activar Radar
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="ghost" 
                                    onClick={() => {
                                        setShowLocationPrompt(false);
                                        onModuleClick(selectedModuleForLocation);
                                        setSelectedModuleForLocation(null);
                                    }}
                                >
                                    No, jugar en pantalla
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full mb-24 select-none relative">
            <div className="flex justify-end mb-4">
                 <Button variant="ghost" size="sm" onClick={() => { playSound('click'); setViewMode('body'); }} leftIcon={<User size={18}/>}>
                    {t('viewBody')}
                 </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedModules.map((group, groupIndex) => {
                    const completedCount = group.filter(m => 
                        (m.type === 'module' || m.type === 'roleplay' || m.type === 'flashcards') && progress[`${m.id}Completed`] ||
                        (m.type === 'exam' && progress.examenPassed)
                    ).length;
                    
                    const totalCount = group.length;
                    const percent = Math.round((completedCount / totalCount) * 100);
                    const missionTitle = MISSION_TITLES[groupIndex] || `Misión ${groupIndex + 1}`;

                    return (
                        <div 
                            key={groupIndex}
                            onClick={() => handleMissionClick(groupIndex)}
                            className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg group border-2 ${percent === 100 ? 'border-green-500 bg-white' : 'border-white bg-white hover:border-blue-300'}`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 opacity-10 transition-colors ${percent === 100 ? 'bg-green-500' : 'bg-blue-600'}`}></div>
                            
                            <div className="p-6 flex items-center relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-5 shadow-inner shrink-0 ${percent === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {percent === 100 ? <CheckCircle2 size={32} /> : <Map size={32} />}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-800 mb-1">{missionTitle}</h3>
                                    <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                                        <Layers size={14} className="mr-1" /> {completedCount}/{totalCount} Módulos
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                                            style={{ width: `${percent}%` }} 
                                        />
                                    </div>
                                </div>

                                <div className="ml-4 text-gray-300 group-hover:text-blue-500 transition-colors">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});