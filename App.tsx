import React, { useState, useEffect, Suspense } from 'react';
import { 
  HeartPulse, Activity, VolumeX, Volume2, Lock, Siren, Trophy, 
  ArrowLeft, Medal, Printer, Zap, ExternalLink, Star, Download, Moon, Sun, Languages
} from 'lucide-react';
import { jsPDF } from 'jspdf';

import { DESA_SIMULATOR_URL, LEVELS, BADGE_DATA, GLOSSARY, ROLEPLAY_SCENARIOS } from './constants';
import { Module } from './types';

// Components
import { PageTransition, GlobalProgressBar, HeroSection, BottomNavigation, ToastNotification, OfflineIndicator, LoadingScreen, Footer } from './components/UI';
import { Button, Input, Select, Card, SkipLink } from './components/DesignSystem';
import { AchievementModal, StreakWidget, PwaInstallPrompt } from './components/Gamification';
import { AdminPinModal } from './components/Admin';

// Context
import { GameProvider, useGame } from './contexts/GameContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Lazy Load Heavy Components
const GuardiaGame = React.lazy(() => import('./components/games/GuardiaGame').then(m => ({ default: m.GuardiaGame })));
const PairGame = React.lazy(() => import('./components/games/PairGame').then(m => ({ default: m.PairGame })));
const AiSimulatorGame = React.lazy(() => import('./components/games/AiSimulatorGame').then(m => ({ default: m.AiSimulatorGame })));
const DuelGame = React.lazy(() => import('./components/games/DuelGame').then(m => ({ default: m.DuelGame })));
const BattlePlayer = React.lazy(() => import('./components/games/ClassroomBattle').then(m => ({ default: m.BattlePlayer }))); // NEW
const AdminPanel = React.lazy(() => import('./components/Admin').then(m => ({ default: m.AdminPanel })));
const LearningMap = React.lazy(() => import('./components/views/Dashboard').then(m => ({ default: m.LearningMap })));
const TrainingView = React.lazy(() => import('./components/views/Dashboard').then(m => ({ default: m.TrainingView })));
const LeaderboardView = React.lazy(() => import('./components/views/Dashboard').then(m => ({ default: m.LeaderboardView })));
const LearningModule = React.lazy(() => import('./components/views/Activities').then(m => ({ default: m.LearningModule })));
const RoleplayGame = React.lazy(() => import('./components/views/Activities').then(m => ({ default: m.RoleplayGame })));
const ExamComponent = React.lazy(() => import('./components/views/Activities').then(m => ({ default: m.ExamComponent })));
const FlashcardComponent = React.lazy(() => import('./components/views/Activities').then(m => ({ default: m.FlashcardComponent })));
const EmergencyView = React.lazy(() => import('./components/views/Activities').then(m => ({ default: m.EmergencyView })));

const UserEntryForm = () => {
    const { createProfile } = useGame();
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [role, setRole] = useState('Alumno 1º ESO');
    const [classCode, setClassCode] = useState(''); // New: Class Code
    const [email, setEmail] = useState(''); // Nuevo: Email del usuario
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Por favor, introduce tu nombre");
            return;
              if (!email.trim() || !email.includes('@')) {
      setError("Por favor, introduce un email válido");
      return;
    }
        }
        setIsSubmitting(true);
        try {
            await createProfile(name, role, classCode, email);
        } catch (e) {
            console.error(e);
            setError("Error al crear perfil");
            setIsSubmitting(false);
        }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-8">
          <div className="text-center mb-8">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartPulse className="text-red-600" size={40} />
              </div>
              <h1 className="text-3xl font-black text-gray-800">{t('appTitle')}</h1>
              <p className="text-gray-500 mt-2">Tu entrenamiento salva vidas</p>
          </div>
          <div className="space-y-4">
            <Input 
                label="Nombre"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Ej. Ana Pérez"
                required
                error={error}
                            />
                        <Input 
            label="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="tu.email@ejemplo.com"
            required
            error={error && !email.includes('@') ? error : ''}
          />          <div className="grid grid-cols-2 gap-4">
                <Select 
                    label="Rol / Curso"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    options={[
                        { value: "Alumno 1º ESO", label: "Alumno 1º ESO" },
                        { value: "Alumno 2º ESO", label: "Alumno 2º ESO" },
                        { value: "Alumno 3º ESO", label: "Alumno 3º ESO" },
                        { value: "Alumno 4º ESO", label: "Alumno 4º ESO" },
                        { value: "Profesorado", label: "Profesorado" },
                        { value: "Otro", label: "Otro" },
                    ]}
                />
                <Input 
                    label="Código Clase (Opcional)"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    placeholder="Ej. 1A"
                    maxLength={5}
                />
            </div>
            
            <Button 
                type="submit" 
                variant="primary" 
                size="xl" 
                fullWidth 
                isLoading={isSubmitting}
                className="mt-4"
            >
                {isSubmitting ? t('startProfile') : t('startBtn')}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">Versión Simulador P.A.S.</p>
          </div>
        </form>
      </div>
    );
};

const AppContent = () => {
    const { 
        profile, loading, progress, currentLevel, currentXp, 
        muted, toggleMute, playSound, updateProgress, 
        showLevelUp, dismissLevelUp, newBadge, dismissBadge,
        darkMode, toggleDarkMode 
    } = useGame();
    const { t, language, setLanguage } = useLanguage();

    // Navigation State
    const [view, setView] = useState('home');
    const [activeTab, setActiveTab] = useState('map');
    const [isEmergencyMode, setIsEmergencyMode] = useState(false);
    const [activeModule, setActiveModule] = useState<any>(null); // Allow any module type now
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showDesa, setShowDesa] = useState(false);
    const [toasts, setToasts] = useState<{ id: string, type: 'success' | 'error' | 'info', message: string }[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleMuteToggle = () => {
        toggleMute();
        showToast(!muted ? "Sonido desactivado" : "Sonido activado", 'info');
    };

    const handleDarkToggle = () => {
        toggleDarkMode();
    };
    
    const cycleLanguage = () => {
        const langs = ['es', 'en', 'fr'] as const;
        const currentIdx = langs.indexOf(language as any);
        const nextLang = langs[(currentIdx + 1) % langs.length];
        setLanguage(nextLang);
        playSound('click');
    };

    useEffect(() => {
        if (showLevelUp) {
            setTimeout(dismissLevelUp, 4000);
        }
    }, [showLevelUp, dismissLevelUp]);

    const handleModuleClick = (mod: any) => {
        playSound('click');
        if (mod.type === 'desa') setShowDesa(true);
        else if (mod.type === 'exam') setView('exam');
        else if (mod.type === 'glossary') setView('glossary');
        else if (mod.type === 'certificate') setView('certificate');
        else if (mod.type === 'flashcards') setView('flashcards');
        else if (mod.type === 'roleplay') { 
            // Standard scenarios from constants
            setActiveModule(ROLEPLAY_SCENARIOS[mod.id]); 
            setView('roleplay'); 
        }
        else if (mod.type === 'custom_roleplay') {
            // Custom scenarios passed full object
            setActiveModule(mod);
            setView('roleplay');
        }
        else if (mod.type === 'pair_game') { setView('pair_game'); } 
        else if (mod.type === 'ai_sim') { setView('ai_sim'); } 
        else if (mod.type === 'duel_game') { setView('duel_game'); } 
        else if (mod.type === 'battle_player') { setView('battle_player'); } 
        else { setActiveModule(mod); setView('module'); }
    };

    const handleTabChange = (tab: string) => {
        if (tab === 'admin') {
            setShowAdminModal(true);
        } else {
            setActiveTab(tab);
            setView('home'); 
        }
    };

    const handleAdminSuccess = () => { setShowAdminModal(false); setView('admin'); };
    
    // NATIVE PDF GENERATION
    const downloadPDF = () => {
        if (!profile) return;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        
        // Background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 297, 210, 'F');
        
        // Border
        doc.setLineWidth(2);
        doc.setDrawColor(200, 160, 50); // Gold
        doc.rect(10, 10, 277, 190);
        doc.setDrawColor(220, 38, 38); // Red inner
        doc.setLineWidth(0.5);
        doc.rect(15, 15, 267, 180);

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(30, 30, 30);
        doc.text("DIPLOMA DE HONOR", 148.5, 50, { align: "center" });

        // Icon placeholder (Circle)
        doc.setFillColor(220, 38, 38);
        doc.circle(148.5, 75, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("+", 148.5, 77, { align: "center" });

        // Text
        doc.setFont("times", "italic");
        doc.setFontSize(20);
        doc.setTextColor(100, 100, 100);
        doc.text("Se otorga el presente certificado a", 148.5, 100, { align: "center" });

        // Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(32);
        doc.setTextColor(220, 38, 38); // Red
        doc.text(profile.name.toUpperCase(), 148.5, 120, { align: "center" });
        doc.setDrawColor(100, 100, 100);
        doc.line(70, 125, 227, 125); // Underline

        // Description
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        const descText = "Por haber completado satisfactoriamente el programa de entrenamiento en Primeros Auxilios Básicos y Reanimación, demostrando competencia teórica y práctica.";
        const splitDesc = doc.splitTextToSize(descText, 200);
        doc.text(splitDesc, 148.5, 140, { align: "center" });

        // Footer
        doc.setFontSize(12);
        doc.text("Fecha: " + new Date().toLocaleDateString(), 50, 180);
        doc.text("Instructor P.A.S.", 230, 180, { align: "right" });
        
        doc.save(`certificado_${profile.name.replace(/\s+/g, '_')}.pdf`);
        showToast("Certificado PDF descargado", "success");
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-red-600 dark:bg-slate-900"><Activity className="animate-spin mr-2"/> Cargando simulador...</div>;
  
  // Allow admin view without profile
  if (view === 'admin') return <AdminPanel onBack={() => { setView('home'); setActiveTab('map'); }} showToast={showToast} />;

      if (!profile) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <UserEntryForm />
      <button
        onClick={() => setShowAdminModal(true)}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all flex items-center gap-2"
        title="Panel de Administrador"
      >
        🔐 Administrador
      </button>
      <AdminPinModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
            <SkipLink />
            <ToastNotification toasts={toasts} removeToast={removeToast} />
            <OfflineIndicator />
            <PwaInstallPrompt />

            <Suspense fallback={null}>
                {isEmergencyMode && <EmergencyView onExit={() => setIsEmergencyMode(false)} />}
            </Suspense>
            
            {!isEmergencyMode && (
                <button 
                    onClick={() => { playSound('alarm'); setIsEmergencyMode(true); }}
                    className="fixed bottom-24 right-4 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl border-4 border-white dark:border-slate-700 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all animate-bounce-subtle"
                    title="Modo Emergencia SOS"
                >
                    <Siren size={32} strokeWidth={2.5} />
                </button>
            )}

            {/* GAMIFICATION OVERLAYS */}
            {newBadge && <AchievementModal badge={newBadge} onClose={dismissBadge} />}

            {showLevelUp && !newBadge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-yellow-500 text-white p-8 rounded-2xl shadow-2xl animate-in zoom-in fade-in duration-500 text-center border-4 border-yellow-300">
                        <Star size={64} className="mx-auto mb-2 animate-spin-slow text-yellow-100" />
                        <h2 className="text-4xl font-black uppercase mb-2">¡Nivel {currentLevel}!</h2>
                        <p className="text-xl font-bold">Ahora eres: {LEVELS[currentLevel-1].name}</p>
                    </div>
                </div>
            )}

            {/* Print Styles for Certificate */}
            {view === 'certificate' && (
                <style>{`
                  @media print {
                    @page { size: landscape; margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-area { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; box-shadow: none; z-index: 9999; background: white; }
                  }
                  @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); } 100% { transform: translateY(100vh) rotate(360deg); } }
                  .confetti { position: fixed; width: 10px; height: 10px; background-color: #f00; animation: confetti-fall 4s linear infinite; z-index: 50; }
                  .c1 { left: 10%; animation-delay: 0s; bg-color: gold; } .c2 { left: 20%; animation-delay: 1s; background-color: blue; } .c3 { left: 30%; animation-delay: 2s; background-color: green; } .c4 { left: 40%; animation-delay: 0.5s; background-color: pink; } .c5 { left: 60%; animation-delay: 1.5s; background-color: orange; } .c6 { left: 80%; animation-delay: 2.5s; background-color: purple; }
                `}</style>
            )}
            {view === 'certificate' && <><div className="confetti c1 no-print"></div><div className="confetti c2 no-print"></div></>}

            {/* View Routing */}
            {view === 'guardia' && (
                <Suspense fallback={<LoadingScreen />}>
                    <GuardiaGame onExit={() => setView('home')} onComplete={(xp) => updateProgress('guardiaXp', xp)} />
                </Suspense>
            )}

            {/* Main Content */}
            <div className="flex-grow w-full relative flex flex-col" id="main-content">
                <GlobalProgressBar />
                
                <main className="max-w-7xl mx-auto p-4 w-full flex-grow flex flex-col pb-24">
                    <PageTransition viewKey={view + activeTab}>
                        {view === 'home' && (
                            <>
                                {activeTab === 'map' && (
                                    <>
                                        <HeroSection onStartModule={handleModuleClick} />
                                        <div className="mb-4 flex justify-between items-end">
                                            <h3 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-xs">{t('navMissions')}</h3>
                                        </div>
                                        <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Cargando mapa...</div>}>
                                            <LearningMap onModuleClick={handleModuleClick} />
                                        </Suspense>
                                    </>
                                )}

                                {activeTab === 'training' && (
                                    <Suspense fallback={<LoadingScreen />}>
                                        <TrainingView onModuleClick={handleModuleClick} />
                                    </Suspense>
                                )}

                                {activeTab === 'ranking' && (
                                    <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Cargando ranking...</div>}>
                                        <LeaderboardView />
                                    </Suspense>
                                )}

                                {activeTab === 'profile' && (
                                    <div className="space-y-6 max-w-2xl mx-auto">
                                        <Card className="text-center">
                                            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                                👤
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h2>
                                            <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
                                            {profile.classCode && <p className="text-xs text-blue-500 font-bold mt-1 bg-blue-50 dark:bg-blue-900/30 inline-block px-2 py-1 rounded">Clase: {profile.classCode}</p>}
                                            <div className="flex justify-center mt-4 space-x-2">
                                                <button onClick={handleMuteToggle} className="p-2 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="Silenciar sonido">
                                                    {muted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                                                </button>
                                                <button onClick={handleDarkToggle} className="p-2 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="Modo Oscuro">
                                                    {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                                                </button>
                                                <button onClick={cycleLanguage} className="p-2 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-bold w-10 h-10 flex items-center justify-center uppercase" title="Cambiar Idioma">
                                                    {language}
                                                </button>
                                            </div>
                                            <div className="mt-4 flex justify-center">
                                                <Button 
                                                    variant={progress.examenPassed ? "secondary" : "outline"} 
                                                    size="sm" 
                                                    onClick={() => {
                                                        if(progress.examenPassed) setView('certificate');
                                                        else showToast("Completa el Examen Final para desbloquear.", "info");
                                                    }} 
                                                    leftIcon={progress.examenPassed ? <Medal size={16}/> : <Lock size={16}/>}
                                                    disabled={!progress.examenPassed}
                                                >
                                                    {progress.examenPassed ? t('certView') : t('certLocked')}
                                                </Button>
                                            </div>
                                        </Card>

                                        {/* Insert Streak Widget Here */}
                                        <StreakWidget streak={progress.streak || 0} />

                                        <Card>
                                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800 dark:text-white"><Trophy className="mr-2 text-yellow-500"/> {t('badges')}</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {BADGE_DATA.map(badge => {
                                                    const unlocked = progress[`${badge.id}Completed`];
                                                    return <div key={badge.id} title={badge.title} className={`p-3 rounded-xl border transition-all duration-500 ${unlocked ? 'bg-white dark:bg-slate-800 border-yellow-200 shadow-md scale-100' : 'bg-gray-50 dark:bg-slate-900 grayscale opacity-40 scale-90 border-transparent'}`}>{React.cloneElement(badge.icon as React.ReactElement, { size: 24 })}</div>
                                                })}
                                            </div>
                                        </Card>

                                        <Card>
                                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Estadísticas</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t('statsXP')}</p>
                                                    <p className="text-2xl font-black text-gray-800 dark:text-white">{currentXp}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t('statsLevel')}</p>
                                                    <p className="text-2xl font-black text-gray-800 dark:text-white">{currentLevel}</p>
                                                </div>
                                            </div>
                                        </Card>
                                        <Button variant="ghost" fullWidth onClick={() => setShowAdminModal(true)} leftIcon={<Lock size={16}/>}>
                                            {t('adminPanel')}
                                        </Button>
                                    </div>
                                )}

                                {activeTab === 'admin' && (
                                    <Suspense fallback={<LoadingScreen />}>
                                        <AdminPanel onBack={() => { setView('home'); setActiveTab('map'); }} showToast={showToast} />
                                    </Suspense>
                                )}
                            </>
                        )}

                        {view !== 'home' && (
                            <div className="pb-10">
                                <Suspense fallback={<LoadingScreen />}>
                                    {view === 'module' && activeModule && <LearningModule module={activeModule} onBack={() => setView('home')} onComplete={() => { playSound('fanfare'); updateProgress(`${activeModule.id}Completed`, true); setView('home'); }} />}
                                    {view === 'roleplay' && activeModule && <RoleplayGame scenarioData={activeModule} onBack={() => setView('home')} onComplete={() => { playSound('fanfare'); updateProgress(`${activeModule.id}Completed`, true); setView('home'); }} />}
                                    {view === 'pair_game' && <PairGame onBack={() => setView('home')} onComplete={(xp) => { playSound('fanfare'); updateProgress('pair_gameCompleted', true); updateProgress('pair_gameXp', (progress['pair_gameXp'] || 0) + xp); setView('home'); }} />}
                                    {view === 'ai_sim' && <AiSimulatorGame onBack={() => setView('home')} onComplete={(xp) => { updateProgress('aiSimXp', (progress['aiSimXp'] || 0) + xp); setView('home'); }} />}
                                    {view === 'duel_game' && <DuelGame onBack={() => setView('home')} />}
                                    {view === 'battle_player' && <BattlePlayer onBack={() => setView('home')} />}
                                    {view === 'flashcards' && <FlashcardComponent onBack={() => setView('home')} onComplete={() => { playSound('fanfare'); updateProgress('flashcardsCompleted', true); setView('home'); }} />}
                                    {view === 'exam' && <ExamComponent onBack={() => setView('home')} onComplete={(score, passed) => { updateProgress('examenCompleted', true); updateProgress('examenPassed', passed); updateProgress('examenScore', score); setView('home'); }} />}
                                </Suspense>
                                
                                {view === 'glossary' && (
                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow min-h-[500px] max-w-3xl mx-auto text-gray-800 dark:text-gray-100">
                                        <button onClick={() => setView('home')} className="mb-4 flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600"><ArrowLeft className="mr-2"/> Volver</button>
                                        <h2 className="text-3xl font-bold mb-6 text-red-600 border-b dark:border-slate-700 pb-2">Glosario</h2>
                                        <div className="space-y-4">{GLOSSARY.map((g, i) => <div key={i}><h3 className="font-bold text-lg">{g.t}</h3><p>{g.d}</p></div>)}</div>
                                    </div>
                                )}
                                {view === 'certificate' && profile && (
                                    <div className="print-area flex flex-col items-center justify-center w-full bg-white p-10 min-h-screen">
                                        <div className="w-full max-w-4xl border-8 border-double border-gray-800 p-10 text-center relative bg-white shadow-2xl print:shadow-none print:border-4">
                                            <div className="absolute top-4 left-4 text-4xl text-yellow-500">✦</div>
                                            <div className="absolute top-4 right-4 text-4xl text-yellow-500">✦</div>
                                            <div className="absolute bottom-4 left-4 text-4xl text-yellow-500">✦</div>
                                            <div className="absolute bottom-4 right-4 text-4xl text-yellow-500">✦</div>
                                            
                                            <div className="mb-8 text-yellow-500 flex justify-center"><Medal size={80} /></div>
                                            
                                            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4 uppercase tracking-wider">Diploma de Honor</h1>
                                            <p className="text-xl text-gray-500 font-serif italic mb-8">Certifica que</p>
                                            
                                            <h2 className="text-4xl font-bold text-red-700 mb-6 border-b-2 border-gray-300 inline-block px-12 pb-2 font-mono">{profile.name}</h2>
                                            
                                            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                                            Ha completado satisfactoriamente el programa de entrenamiento en <strong>Primeros Auxilios Básicos y Reanimación</strong>, demostrando competencia teórica y práctica en situaciones de emergencia.
                                            </p>
                                            
                                            <div className="flex justify-between items-end mt-16 px-10">
                                            <div className="text-center">
                                                <div className="w-40 border-t border-gray-400 mb-2"></div>
                                                <p className="text-sm font-bold text-gray-600 uppercase">Firma del Instructor</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="p-4 border-4 border-red-800 rounded-full w-24 h-24 flex items-center justify-center text-red-800 font-bold transform -rotate-12 opacity-80">
                                                    SELLO OFICIAL
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-gray-800 mb-2">{new Date().toLocaleDateString()}</p>
                                                <div className="w-40 border-t border-gray-400 mb-2"></div>
                                                <p className="text-sm font-bold text-gray-600 uppercase">Fecha</p>
                                            </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 flex flex-col items-center gap-4 no-print w-full max-w-md">
                                            <div className="flex gap-4 w-full">
                                                <Button onClick={downloadPDF} variant="primary" className="flex-1" leftIcon={<Download size={20} />}>
                                                    Descargar PDF Oficial
                                                </Button>
                                                <Button onClick={() => window.print()} variant="secondary" className="flex-1" leftIcon={<Printer size={20} />}>
                                                    Imprimir Simple
                                                </Button>
                                            </div>
                                            <Button onClick={() => setView('home')} variant="ghost" className="w-full">
                                                Volver
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {view === 'admin' && (
                                    <Suspense fallback={<LoadingScreen />}>
                                        <AdminPanel onBack={() => { setView('home'); setActiveTab('map'); }} showToast={showToast} />
                                    </Suspense>
                                )}
                            </div>
                        )}
                    </PageTransition>
                    <Footer />
                </main>
            </div>

            {view === 'home' && <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />}

            {showDesa && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <Card className="max-w-md text-center animate-in zoom-in" padding="lg">
                    <Zap size={64} className="mx-auto text-yellow-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Accediendo al Simulador DESA</h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">Serás redirigido al simulador externo de desfibrilador.</p>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowDesa(false)} variant="ghost" fullWidth>Cancelar</Button>
                        <a href={DESA_SIMULATOR_URL} target="_blank" rel="noreferrer" onClick={() => setShowDesa(false)} className="w-full">
                            <Button variant="secondary" fullWidth rightIcon={<ExternalLink size={16}/>}>Abrir</Button>
                        </a>
                    </div>
                  </Card>
                </div>
            )}

            <AdminPinModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onSuccess={handleAdminSuccess} />
        </div>
    );
};

function App() {
  return (
    <LanguageProvider>
        <GameProvider>
            <AppContent />
        </GameProvider>
    </LanguageProvider>
  );
}

export default App;
