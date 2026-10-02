import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Activity, HeartPulse, Sparkles, Play, Star, BadgeCheck, XCircle, Award, ShoppingBag, Trophy, FileText, Download, CheckCircle2, ArrowLeft, User, UserCheck, GraduationCap, Zap, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCheatSheet, generateDiplomaPDF } from './utils/pdfGenerator';
import { STORE_ITEMS } from './data/storeCatalog';
import { useToast } from './hooks/useToast';
import { useTheme } from './hooks/useTheme';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useXPProgression } from './hooks/useXPProgression';
import { useSchoolActions } from './hooks/useSchoolActions';
import { useExamCompletion } from './hooks/useExamCompletion';
import { usePracticeSession } from './hooks/usePracticeSession';
import { useStore } from './hooks/useStore';
import { useQuests } from './hooks/useQuests';
import { useClassAssignments } from './hooks/useClassAssignments';
import { useExamSetup } from './hooks/useExamSetup';
import { useKeyboard } from './hooks/useKeyboard';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// Components
import Layout from './components/layout/Layout';
import LearningModule from './components/dashboard/LearningModule';
import ToastContainer from './components/common/Toast';
import OfflineBanner from './components/ui/OfflineBanner';
import HelpTutorial from './components/dashboard/HelpTutorial';

// Lazy Components
const ExamComponent = React.lazy(() => import('./components/dashboard/ExamComponent'));
const AdminPanel = React.lazy(() => import('./components/dashboard/AdminPanel'));
const RoleplayGame = React.lazy(() => import('./components/games/RoleplayGame'));
const GuardiaGame = React.lazy(() => import('./components/games/GuardiaGame'));
const Leaderboard = React.lazy(() => import('./components/dashboard/Leaderboard'));
const TimeTrialExam = React.lazy(() => import('./components/dashboard/TimeTrialExam'));
const LegalDisclaimer = React.lazy(() => import('./components/common/LegalDisclaimer'));
const PrivacyPolicy = React.lazy(() => import('./components/common/PrivacyPolicy'));
const NotFound = React.lazy(() => import('./components/pages/NotFound'));
const DeleteAccountPage = React.lazy(() => import('./components/pages/DeleteAccountPage'));
const CertificatePage = React.lazy(() => import('./components/pages/CertificatePage'));
const VerifyCertificatePage = React.lazy(() => import('./components/pages/VerifyCertificatePage'));
const ProfilePage = React.lazy(() => import('./components/pages/ProfilePage'));
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const SurpriseExamModal = React.lazy(() => import('./components/common/SurpriseExamModal'));
const StreakCounter = React.lazy(() => import('./components/common/StreakCounter'));
const StreakMilestoneCelebration = React.lazy(() => import('./components/common/StreakMilestoneCelebration'));
const StoreComponent = React.lazy(() => import('./components/dashboard/StoreComponent'));
const ProfileView = React.lazy(() => import('./components/dashboard/ProfileView'));
const GlossaryView = React.lazy(() => import('./components/dashboard/GlossaryView'));
const PracticeMode = React.lazy(() => import('./components/dashboard/PracticeMode'));
const DesaSimulator = React.lazy(() => import('./components/games/DesaSimulator'));
const SignatureModal = React.lazy(() => import('./components/common/SignatureModal'));


const DashboardSkeleton = React.lazy(() => import('./components/common/Skeleton').then(module => ({ default: module.DashboardSkeleton })));

// Constants
// Constants
import {
  MODULES_ES, MODULES_EN,
  GLOSSARY_ES, GLOSSARY_EN,
  LEVELS_ES, LEVELS_EN,
  ROLEPLAY_SCENARIOS_ES, ROLEPLAY_SCENARIOS_EN,
  DAILY_SCENARIOS_ES, DAILY_SCENARIOS_EN,
  EXAM_QUESTIONS_ES, EXAM_QUESTIONS_EN,
  AVATARS_ES, AVATARS_EN,
  HIDDEN_BADGES_ES, HIDDEN_BADGES_EN,
  QUESTION_CATEGORIES_ES,
  XP_REWARDS, ADMIN_PIN
} from './data/constants';
import { TRANSLATIONS } from './data/translations';


// --- CONFIGURATION ---
// Ideally moving this to a config file, but kept here for now as requested by user constraints/simplicity
let firebaseConfig;
try {
  if (typeof __firebase_config !== 'undefined') {
    firebaseConfig = JSON.parse(__firebase_config);
    firebaseConfig.appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  } else {
    firebaseConfig = {
      apiKey: "AIzaSyANi0ImaTKfxQUKwPZ0A48cvie5QKN0eFo",
      authDomain: "primeros-auxilios-app.firebaseapp.com",
      databaseURL: "https://primeros-auxilios-app-default-rtdb.firebaseio.com",
      projectId: "primeros-auxilios-app",
      storageBucket: "primeros-auxilios-app.firebasestorage.app",
      messagingSenderId: "383085206122",
      appId: "1:383085206122:web:87e987fd4f6c41a5f80813",
      measurementId: "G-6FE3XD2QT5"
    };
  }
} catch (e) {
  console.error('Firebase config error:', e);
  firebaseConfig = { apiKey: 'mock-key', appId: 'default-app-id' };
}

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
const auth = getAuth(app);


// --- SOUND ENGINE ---
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;
const playSound = (type) => {
  try {
    if (!audioCtx || audioCtx.state === 'closed') return;
    if (localStorage.getItem('app_muted') === 'true') return;
    try { if (navigator.vibrate) navigator.vibrate(type === 'error' ? 30 : 10); } catch (e) { }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => { });
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'success') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'click') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'fanfare') {
      [0, 0.1, 0.2, 0.4].forEach((delay, i) => {
        const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination);
        o.frequency.value = [440, 554, 659, 880][i]; g.gain.setValueAtTime(0.1, now + delay); g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
        o.start(now + delay); o.stop(now + delay + 0.5);
      });
    } else if (type === 'levelup') {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination);
      o.type = 'square'; o.frequency.setValueAtTime(440, now); o.frequency.linearRampToValueAtTime(880, now + 0.5);
      g.gain.setValueAtTime(0.1, now); g.gain.linearRampToValueAtTime(0, now + 0.5);
      o.start(now); o.stop(now + 0.5);
    } else if (type === 'alarm') {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sawtooth'; o.frequency.setValueAtTime(800, now); o.frequency.linearRampToValueAtTime(600, now + 0.3);
      g.gain.setValueAtTime(0.05, now); g.gain.linearRampToValueAtTime(0, now + 0.3);
      o.start(now); o.stop(now + 0.3);
    } else if (type === 'powerup') {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine'; o.frequency.setValueAtTime(220, now); o.frequency.linearRampToValueAtTime(880, now + 0.3);
      g.gain.setValueAtTime(0.1, now); g.gain.linearRampToValueAtTime(0, now + 0.3);
      o.start(now); o.stop(now + 0.3);
    } else if (type === 'gameover') {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sawtooth'; o.frequency.setValueAtTime(440, now); o.frequency.linearRampToValueAtTime(110, now + 0.5);
      g.gain.setValueAtTime(0.1, now); g.gain.linearRampToValueAtTime(0, now + 0.5);
      o.start(now); o.stop(now + 0.5);
    } else if (type === 'notification') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(880, now); osc.frequency.setValueAtTime(1100, now + 0.1);
      gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    }
  } catch (e) {
    console.warn("Audio error:", e);
  }
};


// --- APP ENTRY ---
const App = () => {
  const { toasts, addToast, removeToast } = useToast(playSound);

  const { user, profile, setProfile, progress, setProgress, progressRef, loading, isBlocked, currentStreak, setCurrentStreak, handleAuth: fbHandleAuth, handleLogout: fbHandleLogout } = useFirebaseAuth(db, auth, firebaseConfig.appId, addToast, confetti);

  const handleAuth = fbHandleAuth;
  const handleLogout = async () => { await fbHandleLogout(); setView('home'); };
  const [view, setView] = useState('home');
  const [activeModule, setActiveModule] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDesa, setShowDesa] = useState(false);
  const [muted, setMuted] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme(progress, STORE_ITEMS);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState(() => localStorage.getItem('teacher_signature'));
  const [lang, setLang] = useState('es'); // 'es' or 'en'
  const [verificationData, setVerificationData] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const { isOnline, wasOffline } = useOnlineStatus();

  useKeyboard({
    Escape: () => {
      const currentView = document.querySelector('[data-view-active]')?.getAttribute('data-view-active') || view;
      if (showAdminModal) setShowAdminModal(false);
      else if (showDesa) setShowDesa(false);
      else if (showDailyChallenge) setShowDailyChallenge(false);
      else if (showSignatureModal) setShowSignatureModal(false);
      else if (showTutorial) setShowTutorial(false);
      else if (view !== 'home' && view !== 'admin') setView('home');
    }
  });

  // Auto-show tutorial on first login
  useEffect(() => {
    if (user && !localStorage.getItem('tutorial_seen')) {
      setShowTutorial(true);
      localStorage.setItem('tutorial_seen', 'true');
    }
  }, [user]);

  const t = TRANSLATIONS[lang];
  // Data Selection based on Language
  const MODULES = lang === 'es' ? MODULES_ES : MODULES_EN;
  const LEVELS = lang === 'es' ? LEVELS_ES : LEVELS_EN;
  const GLOSSARY = lang === 'es' ? GLOSSARY_ES : GLOSSARY_EN;
  const ROLEPLAY_SCENARIOS = lang === 'es' ? ROLEPLAY_SCENARIOS_ES : ROLEPLAY_SCENARIOS_EN;
  const DAILY_SCENARIOS = lang === 'es' ? DAILY_SCENARIOS_ES : DAILY_SCENARIOS_EN;
  const EXAM_QUESTIONS = lang === 'es' ? EXAM_QUESTIONS_ES : EXAM_QUESTIONS_EN;
  const AVATARS = lang === 'es' ? AVATARS_ES : AVATARS_EN;
  const HIDDEN_BADGES = lang === 'es' ? HIDDEN_BADGES_ES : HIDDEN_BADGES_EN;
  useEffect(() => {
    // Check for verification URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('verify') === 'true') {
      try {
        const rawName = params.get('n');
        const rawDate = params.get('d');
        const hash = params.get('h');
        const name = rawName ? decodeURIComponent(atob(rawName)) : '';
        const date = rawDate ? decodeURIComponent(atob(rawDate)) : '';
        setVerificationData({ name, date, hash });
        setView('verify');
      } catch (e) {
        console.error('Verification decoding error:', e);
      }
    }
  }, []);

  // Scroll to top + update page title on view change
  useEffect(() => { window.scrollTo(0, 0); }, [view]);
  useEffect(() => {
    const titles = { home: 'Inicio', exam: 'Examen', module: 'Módulo', practice: 'Práctica', profile: 'Perfil', glossary: 'Glosario', leaderboard: 'Clasificación', store: 'Tienda', timeTrial: 'Contrarreloj', admin: 'Panel Admin', certificate: 'Certificado', verify: 'Verificar', deleteAccount: 'Baja' };
    document.title = `${titles[view] || 'Simulador'} — P.A.S.`;
  }, [view]);

  const [showStreakCelebration, setShowStreakCelebration] = useState(null);
  const [practiceMode, setPracticeMode] = useState('normal'); // 'normal', 'survival', 'errorLab', 'category'
  const [activeCategory, setActiveCategory] = useState(null);

  const { classAssignments, setClassAssignments } = useClassAssignments(
    db, firebaseConfig.appId, profile, progress, addToast, playSound
  );

  const { examConfig, setExamConfig, randomizedExamQuestions, setRandomizedExamQuestions, surpriseExam, setSurpriseExam } = useExamSetup(
    db, firebaseConfig.appId, user, profile, progress, view, EXAM_QUESTIONS
  );

  // Track glossary views
  useEffect(() => {
    if (view === 'glossary') {
      updateProgress({
        'dailyStats.glossaryViews': (progress.dailyStats?.glossaryViews || 0) + 1,
        'weeklyStats.glossaryViews': (progress.weeklyStats?.glossaryViews || 0) + 1
      });
    }
  }, [view]);

  // Combine Daily Scenarios with Exam Questions for variety
  const dailyPool = React.useMemo(() => {
    const examMapped = EXAM_QUESTIONS.map((q, i) => ({
      id: `exam_${i}`,
      q: q.q,
      options: q.opts,
      correct: q.opts.indexOf(q.a),
      explanation: q.expl
    }));
    return [...DAILY_SCENARIOS, ...examMapped];
  }, [EXAM_QUESTIONS, DAILY_SCENARIOS]);

  // useClassAssignments and useExamSetup provide their own effects internally

  const toggleMute = () => {
    setMuted(!muted);
    localStorage.setItem('app_muted', !muted);
  };

  const { updateProgress, isSaving, setIsSaving, currentXp, currentLevel, showLevelUp } = useXPProgression(
    db, firebaseConfig.appId, user, profile, progressRef, setProgress, progress,
    LEVELS, XP_REWARDS, addToast, playSound, confetti, t
  );

  const { handleSelectAvatar, handleJoinClass, handleAccountDeletion } = useSchoolActions(
    db, firebaseConfig.appId, user, setProfile, setProgress, addToast, playSound, confetti, setIsSaving
  );

  const { handleExamAnswer, handleExamComplete, handleSurpriseExamComplete } = useExamCompletion(
    progress, updateProgress, addToast, playSound, confetti, t, XP_REWARDS, setShowStreakCelebration, setCurrentStreak
  );

  const { handlePracticeAnswer } = usePracticeSession(
    progress, updateProgress, practiceMode, addToast, confetti
  );

  const { handleStorePurchase, handleBuyAvatar } = useStore(
    progress, updateProgress, addToast, playSound, lang
  );

  const { handleClaimQuestReward } = useQuests(
    updateProgress, addToast, confetti, playSound
  );

  const updateDailyStats = useCallback((key, value) => {
    updateProgress(`dailyStats.${key}`, value);
  }, [updateProgress]);

  // Daily & Weekly Quests Handler
  // handleClaimQuestReward provided by useQuests

  const handleDesaComplete = () => {
    updateProgress({
      desaCompleted: true,
      xpGain: 100
    });
    addToast(t?.toasts?.desaSuccess || "¡Simulación DESA completada! +100 XP", 'success');
    setShowDesa(false);
  };

  const handleDownloadDiploma = () => {
    if (!signature) {
      setShowSignatureModal(true);
      return;
    }

    generateDiplomaPDF(profile?.name || 'Estudiante', new Date().toLocaleDateString(), t, signature);
    updateProgress({
      certificadoCompleted: true,
      xpGain: 50
    });
    addToast("¡Diploma generado con éxito!", "success");
  };

  const handleSaveSignature = (sigData) => {
    setSignature(sigData);
    localStorage.setItem('teacher_signature', sigData);
    setShowSignatureModal(false);
    // After saving, trigger download automatically
    generateDiplomaPDF(profile?.name || 'Estudiante', new Date().toLocaleDateString(), t, sigData);
    updateProgress({
      certificadoCompleted: true,
      xpGain: 50
    });
    addToast("¡Firma guardada y diploma generado!", "success");
  };


  // handleSelectAvatar, handleAccountDeletion, handleJoinClass provided by useSchoolActions
  // handleStorePurchase, handleBuyAvatar provided by useStore

  // --- SECURITY & ACCESS LOGIC ---
  const allModulesDone = MODULES.map(m => m.id).filter(id => id !== 'examen' && id !== 'desa' && id !== 'glosario' && id !== 'certificado' && id !== 'timeTrial' && !id.startsWith('sim_')).every(id => progress && progress[`${id}Completed`]);
  const examPassed = progress && progress.examenPassed;

  const handleModuleClick = (mod) => {
    try { playSound('click'); } catch (e) { }

    // Security Checks
    if (mod.type === 'exam' && !allModulesDone) {
      addToast(t?.errors?.modulesIncomplete || "Debes completar todos los módulos teóricos primero.", "error");
      return;
    }
    if ((mod.type === 'certificate' || mod.type === 'desa') && !examPassed) {
      addToast(t?.errors?.examNotPassed || "Debes aprobar el examen final primero.", "error");
      return;
    }

    if (mod.type === 'desa') setShowDesa(true);
    else if (mod.type === 'exam') setView('exam');
    else if (mod.type === 'glossary') setView('glossary');
    else if (mod.type === 'certificate') setView('certificate');
    else if (mod.type === 'timeTrial') setView('timeTrial');
    else if (mod.type === 'roleplay') { setActiveModule(mod); setView('roleplay'); }
    else { setActiveModule(mod); setView('module'); }
  };

  const handleAdminAuth = () => {
    setShowAdminModal(false);
    setView('admin');
  };



  // --- RENDER ---
  if (loading) return (
    <Layout
      view="home" // Mock view
      t={t}
      darkMode={darkMode}
      currentLevel={1}
      currentXp={0}
      isSaving={false}
      toggleDarkMode={() => { }}
      onLogout={() => { }}
    >
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><Activity className="animate-spin text-brand-500" /></div>}>
        <DashboardSkeleton />
      </Suspense>
    </Layout>
  );

  if (!user && view !== 'admin') return (
    <>
      <AdminPinModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onSuccess={handleAdminAuth} t={t} />
      <UserEntryForm onSubmit={handleAuth} playSound={playSound} onAdminClick={() => setShowAdminModal(true)} t={t} />
    </>
  );

  if (user && isBlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in fade-in duration-300">
          <div className="bg-red-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <UserCheck size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">{t?.errors?.accountBlockedTitle || "Acceso Restringido"}</h2>
              <p className="text-red-100 font-medium mt-2">{t?.errors?.accountBlockedSubtitle || "Tu cuenta ha sido suspendida temporalmente."}</p>
            </div>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 text-sm font-medium leading-relaxed">
              <p>{t?.errors?.accountBlockedBody || "Hemos detectado una situación que requiere atención administrativa. Por favor, ponte en contacto con el soporte técnico o tu instructor para resolver este problema."}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              {t?.auth?.logout || "Cerrar Sesión"}
            </button>
            <p className="text-xs text-slate-400 font-medium">ID de Referencia: {user.uid}</p>
          </div>
        </div>
      </div>
    );
  }

  // Logic for locking modules - MOVED UP
  // const allModulesDone = ... 
  // const examPassed = ...

  // Compute Avatar Icon
  const activeAvatarId = progress.activeAvatar || 'default';
  const activeAvatarIcon = STORE_ITEMS.avatars.find(a => a.id === activeAvatarId)?.icon || '👤';

  return (
    <>
      <Layout
        view={view}
        setView={setView}
        profile={{ ...profile, activeAvatarIcon }}
        currentLevel={currentLevel}
        currentXp={currentXp}
        muted={muted}
        toggleMute={toggleMute}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onAdminClick={() => setShowAdminModal(true)}
        onLogout={handleLogout}
        onDeleteAccount={() => setView('deleteAccount')}
        streak={progress.streak || 0}
        lang={lang}
        toggleLang={() => setLang(l => l === 'es' ? 'en' : 'es')}
        t={t}
        onProfileClick={() => setView('profile')}
        isSaving={isSaving}
        classAssignments={classAssignments}
      >
        <OfflineBanner isOnline={isOnline} wasOffline={wasOffline} />
        <HelpTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} t={t} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Suspense fallback={<DashboardSkeleton />}>
          <LegalDisclaimer t={t} />
          {/* GLOBAL FX */}
          {showLevelUp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm">
              <div className="bg-white p-10 rounded-3xl shadow-2xl animate-in zoom-in fade-in duration-500 text-center border-4 border-yellow-400 relative overflow-hidden">
                {/* Sparkles */}
                <div className="absolute top-0 left-0 w-full h-full bg-yellow-400/10 animate-pulse"></div>
                <Star size={80} className="mx-auto mb-4 animate-spin-slow text-yellow-500 fill-yellow-500" />
                <h2 className="text-5xl font-black uppercase mb-2 text-slate-900 tracking-tighter">¡Nivel {currentLevel}!</h2>
                <p className="text-2xl font-bold text-slate-600">Nuevo Rango Desbloqueado</p>
                <div className="mt-4 inline-block bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-black text-lg border-2 border-yellow-400">
                  {LEVELS[currentLevel - 1].name}
                </div>
              </div>
            </div>
          )}

          {/* VIEW ROUTER */}
          {view === 'home' && (
            <HomePage
              profile={profile}
              currentLevel={currentLevel}
              currentXp={currentXp}
              progress={progress}
              activeAvatarIcon={activeAvatarIcon}
              showDailyChallenge={showDailyChallenge}
              dailyPool={dailyPool}
              classAssignments={classAssignments}
              lang={lang}
              t={t}
              allModulesDone={allModulesDone}
              examPassed={examPassed}
              MODULES={MODULES}
              LEVELS={LEVELS}
              setView={setView}
              handleModuleClick={handleModuleClick}
              updateProgress={updateProgress}
              playSound={playSound}
              generateCheatSheet={generateCheatSheet}
              addToast={addToast}
              setShowDailyChallenge={setShowDailyChallenge}
              handleClaimQuestReward={handleClaimQuestReward}
            />
          )}

          {
            view === 'deleteAccount' && (
              <DeleteAccountPage
                onDelete={async () => { await handleAccountDeletion(); setView('home'); }}
                onBack={() => setView('home')}
                t={t}
              />
            )
          }

          {
            view === 'module' && activeModule && (
              <LearningModule
                module={activeModule}
                questions={EXAM_QUESTIONS.filter(q => q.category === activeModule.id)}
                t={t}
                onComplete={() => {
                  updateProgress({
                    [`${activeModule.id}Completed`]: true,
                    'dailyStats.modulesCompleted': (progress.dailyStats?.modulesCompleted || 0) + 1,
                    'weeklyStats.modulesCompleted': (progress.weeklyStats?.modulesCompleted || 0) + 1
                  });
                  setView('home');
                }}
                onBack={() => setView('home')}
                playSound={playSound}
              />
            )
          }

          {
            view === 'roleplay' && activeModule && (
              <RoleplayGame
                scenarioId={activeModule.id}
                scenario={ROLEPLAY_SCENARIOS[activeModule.id]}
                t={t}
                onComplete={() => {
                  updateProgress({
                    [`${activeModule.id}Completed`]: true,
                    'dailyStats.modulesCompleted': (progress.dailyStats?.modulesCompleted || 0) + 1,
                    'weeklyStats.modulesCompleted': (progress.weeklyStats?.modulesCompleted || 0) + 1
                  });
                  setView('home');
                }}
                onBack={() => setView('home')}
                playSound={playSound}
              />
            )
          }

          {
            view === 'exam' && randomizedExamQuestions && (
              <ExamComponent
                questions={randomizedExamQuestions}
                t={t}
                attempts={Array.isArray(progress.examAttempts) ? progress.examAttempts.length : (progress.examAttempts || 0)}
                currentXp={currentXp}
                inventory={progress.inventory || { powerups: {} }}
                onUsePowerup={(id, cost) => {
                  if (cost > 0) {
                    updateProgress('xpGain', -cost);
                  } else {
                    // Consume from inventory
                    const currentCount = progress.inventory?.powerups?.[id] || 0;
                    if (currentCount > 0) {
                      updateProgress(`inventory.powerups.${id}`, currentCount - 1);
                    }
                  }
                }}
                onAnswer={(isCorrect) => handleExamAnswer(currentStreak, isCorrect)}
                onComplete={(rawScore, passed, answers, insuranceUsed, xpMultiplier = 1) =>
                  handleExamComplete(randomizedExamQuestions, rawScore, passed, answers, insuranceUsed, xpMultiplier)
                }
                onBack={() => setView('home')}
                playSound={playSound}
              />
            )
          }

          {
            view === 'guardia' && (
              <GuardiaGame
                onExit={() => setView('home')}
                onComplete={(score) => {
                  const xpEarned = score * 20; // 20 XP per person saved
                  updateProgress({
                    xpGain: xpEarned,
                    'dailyStats.guardiaPlayed': (progress.dailyStats?.guardiaPlayed || 0) + 1,
                    'weeklyStats.guardiaPlayed': (progress.weeklyStats?.guardiaPlayed || 0) + 1
                  });
                  addToast(`¡Turno completado! +${xpEarned} XP`, 'success');
                }}
                playSound={playSound}
              />
            )
          }

          {
            view === 'admin' && (
              <AdminPanel
                onBack={() => setView('home')}
                db={db}
                firebaseConfigId={firebaseConfig.appId}
                playSound={playSound}
                t={t}
                modules={MODULES}
                addToast={addToast}
                user={user}
              />
            )
          }

          {
            view === 'shop' && (
              <StoreComponent
                currentXp={currentXp}
                inventory={progress.inventory || {}}
                onPurchase={handleStorePurchase}
                onBack={() => setView('home')}
                t={t}
              />
            )
          }

          {
            view === 'leaderboard' && (
              <Leaderboard
                db={db}
                firebaseConfigId={firebaseConfig.appId}
                onBack={() => setView('home')}
                currentUserId={user?.uid}
                currentUserRole={profile?.role}
                t={t}
              />
            )
          }

          {
            view === 'timeTrial' && (
              <TimeTrialExam
                questions={EXAM_QUESTIONS}
                t={t}
                onComplete={(xp) => {
                  updateProgress({
                    timeTrialScore: xp, // Persist the score/record
                    xpGain: xp,         // Also add it as XP gain
                    timeTrialCompleted: true
                  });
                  addToast(t?.game?.timetrial?.completed || "¡Contrarreloj Completado!", 'success');
                  setView('home');
                }}
                onBack={() => setView('home')}
                playSound={playSound}
              />
            )
          }

          {
            view === 'glossary' && (
              <GlossaryView
                glossary={GLOSSARY}
                progress={progress}
                onComplete={() => {
                  updateProgress('glosarioCompleted', true);
                  setView('home');
                }}
                onBack={() => setView('home')}
                playSound={playSound}
                addToast={addToast}
                updateDailyStats={updateDailyStats}
              />
            )
          }

          {
            view === 'practice' && (
              <PracticeMode
                questions={EXAM_QUESTIONS}
                onBack={() => setView('home')}
                failedQuestions={progress.failedQuestions || []}
                masteredQuestions={progress.masteredQuestions || []}
                categories={QUESTION_CATEGORIES_ES}
                glossary={GLOSSARY}
                onAnswer={(isCorrect, sessionCount, questionData, streakCount) =>
                  handlePracticeAnswer(isCorrect, sessionCount, questionData, streakCount)
                }
                playSound={playSound}
                addToast={addToast}
              />
            )
          }


          {
            view === 'certificate' && profile && (
              <CertificatePage
                profile={profile}
                t={t}
                onDownload={handleDownloadDiploma}
                onSaveSignature={handleSaveSignature}
                onBack={() => setView('home')}
              />
            )
          }

          {/* Verification View */}
          {
            view === 'verify' && verificationData && (
              <VerifyCertificatePage verificationData={verificationData} onBack={() => setView('home')} />
            )
          }

          {/* Global Component: Insignias Panel always visible on Home */}


          {/* Signature Modal */}
          <Suspense fallback={null}>
            <SignatureModal
              isOpen={showSignatureModal}
              onClose={() => setShowSignatureModal(false)}
              onSave={handleSaveSignature}
              t={t}
            />
          </Suspense>

          {/* Admin Modal */}

          {/* DESA Modal */}
          {
            showDesa && (
              <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-[40px] w-full max-w-6xl h-[85vh] relative overflow-hidden shadow-2xl border-4 border-slate-800">
                  <React.Suspense fallback={<div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white"><Activity className="animate-spin mb-4" size={48} /> <p className="font-bold">Cargando Simulador Avanzado...</p></div>}>
                    <DesaSimulator
                      onBack={() => setShowDesa(false)}
                      onComplete={handleDesaComplete}
                      playSound={playSound}
                      t={t}
                      lang={lang}
                    />
                  </React.Suspense>
                </div>
              </div>
            )
          }



          {/* Profile / Inventory View */}
          {view === 'profile' && (
            <ProfilePage
              progress={progress}
              currentLevel={currentLevel}
              currentXp={currentXp}
              profile={profile}
              t={t}
              lang={lang}
              modules={MODULES}
              hiddenBadges={HIDDEN_BADGES}
              onBack={() => setView('home')}
              onJoinClass={handleJoinClass}
              onEquipAvatar={(id) => { updateProgress('activeAvatar', id); addToast(t?.toasts?.avatarEquipped || "Avatar equipado", 'success'); }}
              onEquipTheme={(id) => { updateProgress('activeTheme', id); addToast(t?.toasts?.themeEquipped || "Tema aplicado", 'success'); }}
            />
          )}

          {/* Streak Counter - Show during modules/exams */}
          {(view === 'module' || view === 'exam') && currentStreak > 0 && (
            <StreakCounter currentStreak={currentStreak} bestStreak={progress.bestStreak || 0} compact={true} />
          )}

          {/* Streak Milestone Celebration */}
          {showStreakCelebration && (
            <StreakMilestoneCelebration
              milestone={showStreakCelebration}
              onClose={() => setShowStreakCelebration(null)}
            />
          )}

        </Suspense>
      </Layout >

      {/* Surprise Exam Modal - Moved outside Layout for better positioning */}
      {
        surpriseExam && (
          <React.Suspense fallback={null}>
            <SurpriseExamModal
              questions={surpriseExam.questions || []}
              onComplete={(rawScore, passed, answers) =>
                  handleSurpriseExamComplete(surpriseExam, rawScore, passed, answers)
                }
              onClose={() => setSurpriseExam(null)}
              t={t}
              playSound={playSound}
              currentXp={currentXp}
              onUsePowerup={(cost) => {
                updateProgress('xpGain', -cost);
              }}
            />
          </React.Suspense>
        )
      }
      {/* Admin Auth Modal (Available Globally) */}
      <AdminPinModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onSuccess={async () => {
        setView('admin');
        await handleAdminAuth();
      }} t={t} />

    </>
  );
};

// --- AUTH COMPONENT (Internal) ---
// --- AUTH COMPONENT (Internal) ---
const UserEntryForm = ({ onSubmit, playSound, onAdminClick, t }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({ name: '', role: 'Alumno 5º Primaria', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!formData.name.trim()) return;
      if (formData.password !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor, asegúrate de escribir la misma contraseña en ambos campos.');
        if (playSound) playSound('error');
        return;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        if (playSound) playSound('error');
        return;
      }
    }
    if (!formData.email.trim() || !formData.password.trim()) return;

    setLoading(true);
    if (playSound) playSound('click');

    try {
      await onSubmit(formData, isRegister);
    } catch (e) {
      console.error(e);
      let msg = 'Error en la autenticación.';
      if (e.code === 'auth/email-already-in-use') msg = 'El email ya está registrado. Prueba a iniciar sesión.';
      if (e.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.';
      if (e.code === 'auth/user-not-found') msg = 'Usuario no encontrado.';
      if (e.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres.';
      if (e.code === 'auth/invalid-credential') msg = 'Credenciales inválidas.';
      if (e.code === 'auth/operation-not-allowed') msg = 'Habilita "Email/Password" en Firebase Console.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-in fade-in duration-500">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-bl-full opacity-50 z-0"></div>

        <div className="relative z-10 text-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500 shadow-sm transform -rotate-6 transition-transform hover:rotate-6">
            <HeartPulse size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Simulador PAS</h1>
          <p className="text-slate-500 font-medium mt-1">Tu formación vital empieza aquí.</p>
        </div>

        {/* Toggle Login/Register */}
        <div className="relative z-10 flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); setConfirmPassword(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegister ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Crear Cuenta
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); setConfirmPassword(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRegister ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Iniciar Sesión
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg flex items-center relative z-10 animate-in shake">
            <AlertTriangle size={16} className="mr-2 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isRegister && (
            <div className="animate-in slide-in-from-left-4 fade-in duration-300">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nombre Completo</label>
              <input
                required={isRegister}
                autoComplete="name"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
                placeholder="Ej. Ana García"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Correo Electrónico</label>
            <input
              required
              type="email"
              autoComplete="email"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
              placeholder="usuario@ejemplo.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Contraseña</label>
            <input
              required
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError('');
              }}
            />
          </div>

          {isRegister && (
            <div className="animate-in slide-in-from-left-4 fade-in duration-300">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Repetir Contraseña</label>
              <input
                required={isRegister}
                type="password"
                autoComplete="new-password"
                className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none transition-all ${
                  confirmPassword && confirmPassword !== formData.password
                    ? 'border-red-400 focus:border-red-500 focus:bg-white'
                    : 'border-slate-100 focus:border-brand-500 focus:bg-white'
                }`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              {confirmPassword && confirmPassword !== formData.password && (
                <p className="text-xs text-red-500 font-bold mt-1 ml-1 animate-in fade-in">Las contraseñas no coinciden</p>
              )}
            </div>
          )}

          {isRegister && (
            <div className="animate-in slide-in-from-left-4 fade-in duration-300">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Curso / Rol</label>
              <div className="relative">
                <select
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option>Alumno 5º Primaria</option>
                  <option>Alumno 6º Primaria</option>
                  <option>Alumno 1º ESO</option>
                  <option>Alumno 2º ESO</option>
                  <option>Alumno 3º ESO</option>
                  <option>Alumno 4º ESO</option>
                  <option>Otro</option>
                  <option>Profesorado</option>
                </select>
              </div>
            </div>
          )}

          {isRegister && (
            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-xl leading-relaxed animate-in fade-in">
              🔒 <strong>Protección de Datos:</strong> Uso escolar docente bajo el <strong>RGPD</strong> y la <strong>LOMLOE</strong>. No cedemos datos a terceros ni usamos rastreadores publicitarios.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 hover:scale-[1.02] active:scale-95 transition-all text-lg mt-2"
          >
            {loading ? (isRegister ? 'Registrando...' : 'Iniciando...') : (isRegister ? 'Registrarse Gratis' : 'Entrar')}
          </button>

          {/* Links for Privacy and Terms */}
          <div className="flex items-center justify-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="hover:text-brand-600 underline underline-offset-2 transition-colors"
            >
              Privacidad y RGPD
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="hover:text-brand-600 underline underline-offset-2 transition-colors"
            >
              Aviso Legal
            </button>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 mt-4 justify-center">
            <span className="text-[10px] bg-red-500 text-white px-1 rounded font-bold">v1.7</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAdminClick();
              }}
              className="text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <GraduationCap size={14} /> Acceso Docente / Admin
            </button>
          </div>
        </form>

        <Suspense fallback={null}>
          {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} t={t} />}
          {showTerms && <LegalDisclaimer isOpen={showTerms} onClose={() => setShowTerms(false)} t={t} />}
        </Suspense>
      </div>
    </div>
  )
}

const AdminPinModal = ({ isOpen, onClose, onSuccess, t }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) onSuccess();
    else { setError(true); setPin(''); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in">
        <h3 className="text-xl font-black text-slate-800 mb-4 text-center">{t?.adminAuth?.title || "Acceso Docente"}</h3>
        <p className="text-sm text-slate-500 text-center mb-6">{t?.adminAuth?.desc || "Introduce el PIN de seguridad para acceder al panel de control."}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            maxLength={4}
            className={`w-full text-center text-4xl font-black tracking-[1em] mb-6 border-b-4 outline-none py-2 ${error ? 'border-red-500 text-red-500' : 'border-slate-200 text-slate-800 focus:border-brand-500'}`}
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            placeholder="••••"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">{t?.adminAuth?.cancel || "Cancelar"}</button>
            <button type="submit" disabled={pin.length < 4} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-lg">{t?.adminAuth?.enter || "Entrar"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App;

