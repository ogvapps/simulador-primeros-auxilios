import React, { useState, useEffect, Suspense } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Activity, HeartPulse, Sparkles, BookOpen, AlertTriangle, Play, Star, Printer, BadgeCheck, XCircle, Award, ShoppingBag, Trophy, Flame, FileText, Download, Moon, Sun, CheckCircle2, ArrowLeft, User, UserCheck, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { generateCheatSheet } from './utils/pdfGenerator';
import { selectRandomQuestions } from './utils/examRandomizer';
import { getExamSizeForRole } from './utils/roleExamConfig';
import { updateStreak } from './utils/streakSystem';
import { STORE_ITEMS } from './data/storeCatalog';

// Components
import Layout from './components/layout/Layout';
import LearningModule from './components/dashboard/LearningModule';
import ModuleCard from './components/dashboard/ModuleCard';
import InsigniasPanel from './components/dashboard/InsigniasPanel';
import AvatarShop from './components/dashboard/AvatarShop';
import DailyChallenge from './components/dashboard/DailyChallenge';
import ToastContainer from './components/common/Toast';

// Lazy Components
const ExamComponent = React.lazy(() => import('./components/dashboard/ExamComponent'));
const AdminPanel = React.lazy(() => import('./components/dashboard/AdminPanel'));
const RoleplayGame = React.lazy(() => import('./components/games/RoleplayGame'));
const GuardiaGame = React.lazy(() => import('./components/games/GuardiaGame'));
const Leaderboard = React.lazy(() => import('./components/dashboard/Leaderboard'));
const TimeTrialExam = React.lazy(() => import('./components/dashboard/TimeTrialExam'));
const LegalDisclaimer = React.lazy(() => import('./components/common/LegalDisclaimer'));
const NotFound = React.lazy(() => import('./components/pages/NotFound'));
const SurpriseExamModal = React.lazy(() => import('./components/common/SurpriseExamModal'));
const StreakCounter = React.lazy(() => import('./components/common/StreakCounter'));
const StreakMilestoneCelebration = React.lazy(() => import('./components/common/StreakMilestoneCelebration'));
const StoreComponent = React.lazy(() => import('./components/dashboard/StoreComponent'));
const ProfileView = React.lazy(() => import('./components/dashboard/ProfileView'));


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
  XP_REWARDS, DESA_SIMULATOR_URL, ADMIN_PIN
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
const db = getFirestore(app);
const auth = getAuth(app);


// --- SOUND ENGINE ---
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;
const playSound = (type) => {
  if (!audioCtx || audioCtx.state === 'closed') return;
  if (localStorage.getItem('app_muted') === 'true') return;

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
    o.type = 'sine'; o.frequency.setValueAtTime(300, now); o.frequency.linearRampToValueAtTime(800, now + 0.4);
    g.gain.setValueAtTime(0.1, now); g.gain.linearRampToValueAtTime(0, now + 0.4);
    o.start(now); o.stop(now + 0.4);
  }
};


// --- APP ENTRY ---
const App = () => {
  const [user, setUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    examAttempts: [],
    inventory: { avatars: ['default'], themes: [], powerups: {} },
    activeAvatar: 'default',
    activeTheme: 'default'
  });
  const progressRef = React.useRef(progress);

  React.useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const [view, setView] = useState('home');
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDesa, setShowDesa] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentXp, setCurrentXp] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('app_dark') === 'true');
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [lang, setLang] = useState('es'); // 'es' or 'en'
  const t = TRANSLATIONS[lang];
  const [toasts, setToasts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [examConfig, setExamConfig] = useState({ examSize: 40 }); // Default 40 questions
  const [randomizedExamQuestions, setRandomizedExamQuestions] = useState(null);
  const [surpriseExam, setSurpriseExam] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);



  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Sound effect for toast
    if (type === 'success') playSound('success');
    else if (type === 'error') playSound('error');
    else playSound('click');
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Data Selection
  const MODULES = lang === 'en' ? MODULES_EN : MODULES_ES;
  const LEVELS = lang === 'en' ? LEVELS_EN : LEVELS_ES;
  const GLOSSARY = lang === 'en' ? GLOSSARY_EN : GLOSSARY_ES;
  const ROLEPLAY_SCENARIOS = lang === 'en' ? ROLEPLAY_SCENARIOS_EN : ROLEPLAY_SCENARIOS_ES;
  const DAILY_SCENARIOS = lang === 'en' ? DAILY_SCENARIOS_EN : DAILY_SCENARIOS_ES;
  const EXAM_QUESTIONS = lang === 'en' ? EXAM_QUESTIONS_EN : EXAM_QUESTIONS_ES;
  const AVATARS = lang === 'en' ? AVATARS_EN : AVATARS_ES;
  const HIDDEN_BADGES = lang === 'en' ? HIDDEN_BADGES_EN : HIDDEN_BADGES_ES;

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

  // Theme Selection & Application
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('app_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const activeThemeId = progress.activeTheme || 'default';
    const theme = STORE_ITEMS.themes.find(t => t.id === activeThemeId);

    if (theme && theme.colors) {
      // Set primary and secondary
      document.documentElement.style.setProperty('--brand-500', theme.colors.primary);
      document.documentElement.style.setProperty('--brand-600', theme.colors.primary);
      document.documentElement.style.setProperty('--brand-700', theme.colors.secondary);

      // Also derive a very light version for 50/100 if possible, or just use primary with opacity
      // For now, let's just ensure the main ones are active
    } else {
      // Default Purple Theme (matches original tailwind config defaults)
      document.documentElement.style.setProperty('--brand-50', '#f5f3ff');
      document.documentElement.style.setProperty('--brand-500', '#8b5cf6');
      document.documentElement.style.setProperty('--brand-600', '#7c3aed');
      document.documentElement.style.setProperty('--brand-700', '#6d28d9');
    }
  }, [progress.activeTheme]);

  // Auth & Data
  // Auth & Data
  useEffect(() => {
    // Check if user is already logged in
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Optimistically set user
        setUser(u);
        const unsubProfile = onSnapshot(doc(db, 'artifacts', firebaseConfig.appId, 'users', u.uid, 'profile', 'main'), (snap) => {
          if (snap.exists()) {
            const profileData = snap.data();

            // CHECK BLOCK STATUS
            if (profileData.blocked) {
              setIsBlocked(true);
            } else {
              setIsBlocked(false);
            }

            setProfile(profileData);
          } else {
            setProfile(null);
          }
        });
        const unsubProgress = onSnapshot(doc(db, 'artifacts', firebaseConfig.appId, 'users', u.uid, 'progress', 'main'), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setProgress(data);
            setCurrentXp(data.xp || 0);
            setCurrentLevel(data.level || 1);
            setCurrentStreak(data.currentStreak || 0); // Load streak

            // Check Streak (Once per day)
            const today = new Date().toISOString().slice(0, 10);
            if (data.lastLoginDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().slice(0, 10);

              let newStreak = (data.lastLoginDate === yesterdayStr) ? (data.streak || 0) + 1 : 1;

              // Check Badges
              const currentBadges = data.badges || [];
              const newBadges = [...currentBadges];
              if (newStreak >= 3 && !newBadges.includes('streak_3')) {
                newBadges.push('streak_3');
                addToast(t?.badges?.unlocked || "¡Insignia Desbloqueada!", 'success');
                confetti();
              }
              if (newStreak >= 7 && !newBadges.includes('streak_7')) {
                newBadges.push('streak_7');
                addToast(t?.badges?.unlocked || "¡Insignia Desbloqueada!", 'success');
                confetti();
              }

              setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'users', u.uid, 'progress', 'main'), {
                streak: newStreak,
                lastLoginDate: today,
                badges: newBadges
              }, { merge: true });
            }

          } else {
            setProgress({});
          }
          setLoading(false);
        });
        return () => { unsubProfile(); unsubProgress(); };
      } else {
        setUser(null);
        setProfile(null);
        setProgress({});
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Load Exam Configuration
  useEffect(() => {
    const loadExamConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'artifacts', firebaseConfig.appId, 'public', 'config'));
        if (configDoc.exists()) {
          const config = configDoc.data();
          setExamConfig({
            examSize: config.examSize || 40,
            passingScore: config.passingScore || 7
          });
        }
      } catch (e) {
        console.error('Error loading exam config:', e);
      }
    };
    loadExamConfig();
  }, []);

  // Generate random questions when view changes to exam
  useEffect(() => {
    if (view === 'exam' && EXAM_QUESTIONS && profile) {
      // Determine exam size based on user role
      const roleBasedSize = getExamSizeForRole(profile.role);
      const finalExamSize = examConfig.examSize || roleBasedSize;

      const randomQuestions = selectRandomQuestions(EXAM_QUESTIONS, finalExamSize);
      setRandomizedExamQuestions(randomQuestions);
    }
  }, [view, examConfig.examSize, profile]);

  // Listen for Surprise Exam activation
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'artifacts', firebaseConfig.appId, 'public', 'active_surprise_exam'),
      (snap) => {
        if (snap.exists() && snap.data().active) {
          setSurpriseExam(snap.data());
        } else {
          setSurpriseExam(null);
        }
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Auto-dismiss Surprise Exam if already completed (prevents reload re-trigger)
  useEffect(() => {
    if (surpriseExam && progress?.examAttempts) {
      const alreadyDone = Array.isArray(progress.examAttempts) &&
        progress.examAttempts.some(att => att.type === 'surprise' && new Date(att.date) >= new Date(surpriseExam.startedAt));
      if (alreadyDone) setSurpriseExam(null);
    }
  }, [surpriseExam, progress?.examAttempts]);

  const toggleMute = () => {
    setMuted(!muted);
    localStorage.setItem('app_muted', !muted);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleAuth = async (formData, isRegister) => {
    if (isRegister) {
      // Register
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const u = userCredential.user;
      const data = { name: formData.name, role: formData.role, email: formData.email };

      // Create Profile
      await setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'users', u.uid, 'profile', 'main'), data);

      // Init Progress
      const initProgress = { xp: 0, level: 1 };
      await setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'users', u.uid, 'progress', 'main'), initProgress, { merge: true });

      // Create Public Summary
      await setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'public', 'data', 'user_summaries', u.uid), { userId: u.uid, ...data, lastUpdate: new Date().toISOString(), progress: initProgress });

    } else {
      // Login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const updateProgress = async (keyOrChanges, val, multiplier = 1) => {
    setIsSaving(true);
    try {
      const changes = typeof keyOrChanges === 'object' ? keyOrChanges : { [keyOrChanges]: val };

      // Calculate everything based on the LATEST progress Ref to avoid race conditions
      let updated = { ...progressRef.current };

      Object.entries(changes).forEach(([key, value]) => {
        // XP Gain Logic
        let xpGain = 0;
        if (key === 'examenCompleted' && value === true) xpGain = XP_REWARDS.EXAM_PASS;
        else if (key.endsWith('Completed') && value === true && !updated[key]) xpGain = XP_REWARDS.MODULE_COMPLETE;
        else if (typeof value === 'number' && !['xp', 'level', 'currentStreak', 'examAttempts'].includes(key)) xpGain = value;

        const newXp = (updated.xp || 0) + (xpGain * multiplier);
        let newLevel = updated.level || 1;
        const nextLevelConfig = LEVELS.find(l => l.level === newLevel + 1);

        if (nextLevelConfig && newXp >= nextLevelConfig.minXp) {
          newLevel++;
          setShowLevelUp(true);
          playSound('levelup');
          addToast(t?.toasts?.levelUp || `¡Nivel ${newLevel} Desbloqueado!`, 'success');
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#EF4444'], zIndex: 9999 });
          setTimeout(() => setShowLevelUp(false), 4000);
        }

        updated = { ...updated, xp: newXp, level: newLevel };

        // Handle nested keys
        if (typeof key === 'string' && key.includes('.')) {
          const parts = key.split('.');
          let current = updated;
          for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = current[parts[i]] ? { ...current[parts[i]] } : {};
            current = current[parts[i]];
          }
          current[parts[parts.length - 1]] = value;
        } else {
          updated[key] = value;
        }
      });

      // Update state
      setProgress(updated);
      setCurrentXp(updated.xp);
      setCurrentLevel(updated.level);

      // Persist
      await setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'users', user.uid, 'progress', 'main'), updated, { merge: true });
      await setDoc(doc(db, 'artifacts', firebaseConfig.appId, 'public', 'data', 'user_summaries', user.uid), { progress: updated, lastUpdate: new Date().toISOString() }, { merge: true });

    } catch (error) {
      console.error("Error updating progress:", error);
      addToast('Error saving progress', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStorePurchase = async (category, item) => {
    if (currentXp < item.price) {
      addToast(lang === 'en' ? 'Not enough XP!' : '¡No tienes suficiente XP!', 'error');
      return;
    }

    try {
      const updates = {
        xp: (progress.xp || 0) - item.price
      };

      if (category === 'avatars') {
        const currentAvatars = progress.inventory?.avatars || ['default'];
        if (!currentAvatars.includes(item.id)) {
          updates['inventory.avatars'] = [...currentAvatars, item.id];
        } else {
          addToast(lang === 'en' ? 'Already owned!' : '¡Ya tienes este objeto!', 'info');
          return;
        }
      } else if (category === 'themes') {
        const currentThemes = progress.inventory?.themes || [];
        if (!currentThemes.includes(item.id)) {
          updates['inventory.themes'] = [...currentThemes, item.id];
        } else {
          addToast(lang === 'en' ? 'Already owned!' : '¡Ya tienes este objeto!', 'info');
          return;
        }
      } else if (category === 'powerups') {
        const currentCount = progress.inventory?.powerups?.[item.id] || 0;
        updates[`inventory.powerups.${item.id}`] = currentCount + 1;
      }

      await updateProgress(updates);
      addToast(lang === 'en' ? 'Purchase successful!' : '¡Compra realizada con éxito!', 'success');
      playSound('success');
    } catch (e) {
      console.error('Purchase error:', e);
      addToast(lang === 'en' ? 'Purchase failed' : 'Error en la compra', 'error');
    }
  };

  // Backward compatibility wrapper for old avatar component
  const handleBuyAvatar = (avatar) => {
    handleStorePurchase('avatars', avatar);
  };

  const handleSelectAvatar = async (avatarId) => {
    setIsSaving(true);
    try {
      setProfile(prev => ({ ...prev, avatarId }));
      await updateDoc(doc(db, 'artifacts', firebaseConfig.appId, 'users', user.uid, 'profile', 'main'), { avatarId });
      await updateDoc(doc(db, 'artifacts', firebaseConfig.appId, 'public', 'data', 'user_summaries', user.uid), { avatarId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleModuleClick = (mod) => {
    playSound('click');
    if (mod.type === 'desa') setShowDesa(true);
    else if (mod.type === 'exam') setView('exam');
    else if (mod.type === 'glossary') setView('glossary');
    else if (mod.type === 'certificate') setView('certificate');
    else if (mod.type === 'timeTrial') setView('timeTrial');
    else if (mod.type === 'roleplay') { setActiveModule(mod); setView('roleplay'); }
    else { setActiveModule(mod); setView('module'); }
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

  if (!user) return <UserEntryForm onSubmit={handleAuth} playSound={playSound} />;

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

  // Logic for locking modules
  const allModulesDone = MODULES.map(m => m.id).filter(id => id !== 'exam' && id !== 'desa' && id !== 'glossary' && id !== 'certificado' && !id.startsWith('sim_')).every(id => progress[`${id}Completed`]);
  const examPassed = progress.examenPassed;

  // Compute Avatar Icon
  const activeAvatarId = progress.activeAvatar || 'default';
  const activeAvatarIcon = STORE_ITEMS.avatars.find(a => a.id === activeAvatarId)?.icon || '👤';

  return (
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
    >
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
          <div className="space-y-8 pb-20">
            {/* Dashboard Header / Hero */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6 animate-in slide-in-from-top-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                  {t?.home?.welcome || "Tu Entrenamiento"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                  {t?.home?.subtitle || "Completa todos los módulos teóricos para desbloquear el examen final y obtener tu certificado."}
                </p>
              </div>

              <button
                onClick={() => {
                  generateCheatSheet();
                  playSound('success');
                }}


                className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-all text-sm mb-2 md:mb-0"
              >
                <FileText size={18} />
                <span className="hidden md:inline">{t?.home?.cheatSheet || "Ficha Resumen"}</span>
                <span className="md:hidden">PDF</span>
                <Download size={14} className="opacity-50" />
              </button>




              <div className="flex gap-2">
                <button
                  onClick={() => setView('shop')}
                  className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-yellow-400 hover:scale-105 transition-all group"
                  title={t?.home?.shop}
                >
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-2 rounded-lg mb-1 group-hover:bg-yellow-400 group-hover:text-yellow-900 transition-colors">
                    <ShoppingBag size={20} className="stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t?.home?.shop}</span>
                </button>
                <button
                  onClick={() => setView('profile')}
                  className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-orange-400 hover:scale-105 transition-all group"
                  title={t?.profile?.backpack_btn || "Mochila"}
                >
                  <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg mb-1 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <User size={20} className="stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">P.A.S.</span>
                </button>
                <button
                  onClick={() => setView('leaderboard')}
                  className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:border-brand-400 hover:scale-105 transition-all group"
                  title={t?.home?.rank}
                >
                  <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 p-2 rounded-lg mb-1 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <Trophy size={20} className="stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Rank</span>
                </button>
              </div>

            </div>

            {/* Daily Challenge Card */}
            {(() => {
              const today = new Date().toDateString();
              const lastPlayed = progress.lastDailyChallenge ? new Date(progress.lastDailyChallenge).toDateString() : null;
              const canPlay = today !== lastPlayed;

              return (
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-1 shadow-lg shadow-indigo-200 mt-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-wider text-xs mb-2">
                        <Sparkles size={16} className="text-yellow-300" /> {t?.home?.dailyChallenge?.new}
                      </div>
                      <h2 className="text-3xl font-black mb-2">{t?.home?.dailyChallenge?.title}</h2>
                      <p className="text-indigo-100 font-medium">{t?.home?.dailyChallenge?.desc}</p>
                    </div>
                    {canPlay ? (
                      <button
                        onClick={() => setShowDailyChallenge(true)}
                        className="bg-white text-indigo-600 font-black py-3 px-8 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Play fill="currentColor" size={20} /> {t?.home?.dailyChallenge?.play}
                      </button>
                    ) : (
                      <button disabled className="bg-indigo-800/50 text-indigo-300 font-bold py-3 px-8 rounded-xl cursor-not-allowed flex items-center gap-2">
                        <CheckCircle2 size={20} /> {t?.home?.dailyChallenge?.completed}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Daily Challenge Modal */}
            {showDailyChallenge && (
              <DailyChallenge
                scenarios={dailyPool}
                t={t}
                onComplete={(success) => {
                  setShowDailyChallenge(false);
                  const updates = {
                    lastDailyChallenge: new Date().toISOString()
                  };

                  if (success) {
                    updates.xp = (progress.xp || 0) + 50;
                    addToast(t?.toasts?.dailySuccess || "¡Desafío completado! +50 XP", 'success');
                  }

                  updateProgress(updates);
                }}
                onClose={() => setShowDailyChallenge(false)}
                playSound={playSound}
              />
            )}

            {/* Hero Banner for Guardia Mode */}
            {currentLevel >= 3 ? (
              <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden relative group cursor-pointer border-2 border-slate-700 hover:border-red-500 transition-colors" onClick={() => setView('guardia')}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="absolute top-0 right-0 p-32 bg-red-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-red-500/30">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Acceso Restringido
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-2 italic tracking-tighter">
                      MODO GUARDIA
                    </h2>
                    <p className="text-slate-400 text-lg font-medium max-w-lg">
                      Pon a prueba tus reflejos en situaciones de emergencia real. Contrarreloj.
                    </p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-red-900/50 transform group-hover:scale-105 transition-all flex items-center gap-3 text-lg">
                    <Play fill="currentColor" /> INICIAR TURNO
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Modo Guardia Bloqueado</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Alcanza el <span className="font-bold text-brand-600 dark:text-brand-400">Nivel 3 ({LEVELS[2].name})</span> para desbloquear el simulador de guardia.</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-slate-300 dark:bg-slate-600" style={{ width: `${(currentXp / 400) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Module Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MODULES.map(m => {
                let isLocked = false;
                if (m.type === 'exam') isLocked = !allModulesDone;
                else if (m.type === 'certificate' || m.type === 'desa') isLocked = !examPassed;

                return (
                  <ModuleCard
                    key={m.id}
                    module={m}
                    progress={progress}
                    onClick={() => handleModuleClick(m)}
                    isLocked={isLocked}
                    t={t}
                  />
                );
              })}
            </div>
          </div>
        )
        }

        {
          view === 'deleteAccount' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in">
              <div className="bg-red-50 p-6 rounded-full mb-6 text-red-600 animate-pulse border-4 border-red-100">
                <AlertTriangle size={64} />
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">¿Estás seguro?</h2>
              <p className="text-slate-500 max-w-lg mb-8 text-lg font-medium leading-relaxed">
                Esta acción es <strong>irreversible</strong>. Borraremos todo tu progreso, nivel, medallas y certificados obtenidos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button onClick={handleAccountDeletion} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2">
                  <XCircle size={20} />
                  Sí, Borrar Todo
                </button>
                <button onClick={() => setView('home')} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2">
                  Cancelar
                </button>
              </div>
            </div>
          )
        }

        {
          view === 'module' && activeModule && (
            <LearningModule
              module={activeModule}
              t={t}
              onComplete={() => { updateProgress(`${activeModule.id}Completed`, true); setView('home'); }}
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
              onComplete={() => { updateProgress(`${activeModule.id}Completed`, true); setView('home'); }}
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
                  const newXp = currentXp - cost;
                  updateProgress('xp', newXp);
                } else {
                  // Consume from inventory
                  const currentCount = progress.inventory?.powerups?.[id] || 0;
                  if (currentCount > 0) {
                    updateProgress(`inventory.powerups.${id}`, currentCount - 1);
                  }
                }
              }}
              onAnswer={(isCorrect) => {
                const { newStreak, milestone } = updateStreak(currentStreak, isCorrect);
                setCurrentStreak(newStreak);

                const updates = { currentStreak: newStreak };
                if (milestone) {
                  setShowStreakCelebration(milestone.count);
                  playSound('fanfare');
                  if (milestone.xp) {
                    updates.xp = (progress.xp || 0) + milestone.xp;
                    addToast(`+${milestone.xp} XP - ${milestone.name}!`, 'success');
                  }
                }
                updateProgress(updates);
              }}
              onComplete={(rawScore, passed, answers, insuranceUsed, xpMultiplier = 1) => {
                // 1. Calculate base grade (0-10) using actual question count
                const qCount = randomizedExamQuestions ? randomizedExamQuestions.length : 40;
                const baseGrade = (rawScore / qCount) * 10;

                // 2. Determine max possible grade based on previous attempts
                const currentAttemptsData = progress.examAttempts || 0;
                const attemptCount = Array.isArray(currentAttemptsData) ? currentAttemptsData.length : (Number(currentAttemptsData) || 0);
                const maxGradeAllowed = Math.max(5, 10 - attemptCount);

                // 3. Apply Cap
                let finalGrade = Math.min(baseGrade, maxGradeAllowed);
                finalGrade = Math.max(0, finalGrade);

                // 4. Determine Pass (>= 5)
                const isApproved = finalGrade >= 5;

                // 5. Update Progress History
                const oldAttempts = Array.isArray(progress.examAttempts) ? progress.examAttempts : [];
                let newAttempts = [...oldAttempts];

                if (!(!isApproved && insuranceUsed)) {
                  newAttempts.push({
                    score: rawScore,
                    grade: finalGrade,
                    passed: isApproved,
                    answers,
                    date: new Date().toISOString(),
                    type: 'normal'
                  });
                } else {
                  playSound('powerup');
                }

                if (isApproved) {
                  const updates = {
                    examenPassed: true,
                    examenCompleted: true,
                    examAttempts: newAttempts,
                    examenScore: finalGrade.toFixed(2)
                  };
                  if (answers) updates.examAnswers = answers;

                  updateProgress(updates, null, xpMultiplier);
                  if (xpMultiplier > 1) addToast("¡XP DOBLE ACTIVADO!", 'success');
                  playSound('success');
                  confetti();
                } else {
                  const updates = {
                    examAttempts: newAttempts,
                    examenScore: finalGrade.toFixed(2)
                  };
                  if (answers) updates.examAnswers = answers;
                  updateProgress(updates);
                }

                setView('home');
              }}
              onBack={() => setView('home')}
              playSound={playSound}
            />
          )
        }

        {
          view === 'guardia' && (
            <GuardiaGame
              onExit={() => setView('home')}
              onComplete={(xp) => updateProgress('guardiaXp', xp)}
              playSound={playSound}
            />
          )
        }

        {
          view === 'store' && (
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
          view === 'admin' && (
            <AdminPanel
              onBack={() => setView('home')}
              db={db}
              firebaseConfigId={firebaseConfig.appId}
              playSound={playSound}
              t={t}
              modules={MODULES}
              addToast={addToast}
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
                updateProgress('timeTrial', xp);
                setView('home');
              }}
              onBack={() => setView('home')}
              playSound={playSound}
            />
          )
        }

        {
          view === 'glossary' && (
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-8">
              <div className="flex items-center mb-10 pb-6 border-b border-slate-100">
                <button onClick={() => setView('home')} className="mr-6 hover:bg-slate-50 p-3 rounded-xl transition-colors"><BookOpen /></button>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Glosario</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GLOSSARY.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all hover:shadow-md group bg-slate-50/50">
                    <h3 className="font-bold text-xl text-brand-600 mb-2 group-hover:text-brand-700">{item.t}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {
          view === 'profile' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 pb-20">
              {/* Header with Back Button */}
              <div className="flex items-center gap-4">
                <button onClick={() => setView('home')} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-brand-600">
                  <ArrowLeft />
                </button>
                <h1 className="text-3xl font-black text-slate-900">Tu Perfil de Agente</h1>
              </div>

              <InsigniasPanel
                progress={progress}
                currentLevel={currentLevel}
                currentXp={currentXp}
                t={t}
                modules={MODULES}
                hiddenBadges={HIDDEN_BADGES}
              />
            </div>
          )
        }

        {
          view === 'certificate' && profile && (
            <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 overflow-x-hidden print:p-0 print:bg-white">
              {/* Force Landscape Printing */}
              <style>{`
            @media print {
              @page { size: landscape; margin: 0; }
              body { -webkit-print-color-adjust: exact; }
            }
          `}</style>

              <div className="bg-white p-6 md:p-12 rounded-lg shadow-2xl w-full max-w-6xl aspect-[1.41] md:aspect-[1.41] flex flex-col justify-center text-center border-[10px] md:border-[20px] border-double border-yellow-600 relative overflow-hidden print:absolute print:top-0 print:left-0 print:w-full print:h-screen print:border-0 print:shadow-none print:z-[100] transform scale-[0.65] md:scale-100 origin-center h-fit">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <BadgeCheck size={500} />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="mb-4 md:mb-8">
                    <Award size={80} className="text-yellow-500 fill-yellow-100 inline-block" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-2 md:mb-4 uppercase tracking-widest">Certificado de Honor</h1>
                  <div className="w-32 h-1 bg-yellow-500 mx-auto mb-6 md:mb-10"></div>

                  <p className="text-xl md:text-2xl text-slate-500 font-serif italic mb-4 md:mb-8">Se otorga el presente reconocimiento a</p>

                  <h2 className="text-5xl md:text-7xl font-black text-brand-700 mb-6 md:mb-10 font-serif border-b-4 border-slate-200 inline-block px-12 pb-4">
                    {profile.name}
                  </h2>

                  <p className="text-lg md:text-xl text-slate-600 font-serif leading-relaxed max-w-4xl mx-auto mb-10 md:mb-16">
                    Por haber completado satisfactoriamente el programa de entrenamiento digital en<br />
                    <strong className="text-slate-900 text-2xl md:text-3xl mt-2 block">Primeros Auxilios y Soporte Vital Básico</strong>
                  </p>

                  <div className="flex justify-between w-full max-w-4xl mx-auto px-10 md:mt-auto">
                    <div className="text-center">
                      <div className="w-48 border-b-2 border-slate-800 mb-2"></div>
                      <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Firma del Director</p>
                    </div>
                    <div className="text-center">
                      <div className="w-48 border-b-2 border-slate-800 mb-2"></div>
                      <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Fecha de Expedición</p>
                      <p className="text-sm font-serif">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 right-8 print:hidden flex gap-2">
                  <button onClick={() => window.print()} className="bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 shadow-lg hover:scale-110 transition-transform" title="Imprimir">
                    <Printer />
                  </button>
                  <button onClick={() => setView('home')} className="bg-slate-200 text-slate-500 p-3 rounded-full hover:bg-slate-300 hover:scale-110 transition-transform" title="Cerrar">
                    <XCircle />
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Global Component: Insignias Panel always visible on Home */}


        {/* Admin Modal */}
        <AdminPinModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onSuccess={() => { setShowAdminModal(false); setView('admin'); }} t={t} />

        {/* DESA Modal */}
        {
          showDesa && (
            <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] relative overflow-hidden shadow-2xl">
                <button onClick={() => setShowDesa(false)} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-sm transition-colors"><XCircle size={28} /></button>
                <iframe src={DESA_SIMULATOR_URL} title="Simulador DESA" className="w-full h-full border-0 bg-slate-100" />
              </div>
            </div>
          )
        }

        {/* Surprise Exam Modal */}
        {surpriseExam && (
          <SurpriseExamModal
            questions={surpriseExam.questions || []}
            onComplete={(rawScore, passed, answers) => {
              // 1. Prepare Updates
              const xpMultiplier = surpriseExam.xpMultiplier || 1;
              const xpGain = passed ? XP_REWARDS.EXAM_PASS : 50;

              const qCount = surpriseExam.questions?.length || 20;
              const grade = (rawScore / qCount) * 10;
              const oldAttempts = Array.isArray(progress.examAttempts) ? progress.examAttempts : [];
              const newAttempts = [...oldAttempts, {
                score: rawScore,
                grade: grade,
                passed,
                answers,
                type: 'surprise',
                date: new Date().toISOString()
              }];

              // 2. Perform ATOMIC update
              updateProgress({
                surpriseExamXP: xpGain,
                examAttempts: newAttempts
              }, null, xpMultiplier);

              // 3. Feedback
              const displayXp = passed ? (XP_REWARDS.EXAM_PASS * xpMultiplier) : 50;
              addToast(passed ? (t?.exam?.passed || '¡Examen Sorpresa Aprobado! +' + displayXp + ' XP') : (t?.exam?.completed || 'Examen Sorpresa Completado +' + 50 + ' XP'), passed ? 'success' : 'info');

              // Note: We don't setSurpriseExam(null) here so user can see the result screen in ExamComponent
            }}
            onClose={() => setSurpriseExam(null)}
            t={t}
            playSound={playSound}
            currentXp={currentXp}
            onUsePowerup={(cost) => {
              const newXp = currentXp - cost;
              updateProgress('xp', newXp);
            }}
          />
        )}

        {/* Profile / Inventory View */}
        {view === 'profile' && (
          <ProfileView
            progress={progress}
            t={t}
            lang={lang}
            currentXp={currentXp}
            onBack={() => setView('home')}
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
  );
};

// --- AUTH COMPONENT (Internal) ---
// --- AUTH COMPONENT (Internal) ---
const UserEntryForm = ({ onSubmit, playSound }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({ name: '', role: 'Alumno 5º Primaria', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && !formData.name.trim()) return;
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
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegister ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Crear Cuenta
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
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
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 hover:scale-[1.02] active:scale-95 transition-all text-lg mt-2"
          >
            {loading ? (isRegister ? 'Registrando...' : 'Iniciando...') : (isRegister ? 'Registrarse Gratis' : 'Entrar')}
          </button>

          {!isRegister && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsRegister(true);
                  setFormData({ name: 'Profe Admin', role: 'Profesorado', email: 'admin@edu.es', password: 'adminpassword' });
                  setError('Haz clic en "Registrarse Gratis" para crear esta cuenta.');
                }}
                className="text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <GraduationCap size={14} /> Acceso Docente / Admin
              </button>
            </div>
          )}
        </form>
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
