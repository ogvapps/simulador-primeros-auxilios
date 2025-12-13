import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signInWithCustomToken, signInAnonymously, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, appId, isMock } from '../firebaseConfig';
import { UserProfile, UserProgress, Badge } from '../types';
import { LEVELS, XP_REWARDS, BADGE_DATA } from '../constants';
import { playSound as playSoundUtil } from '../utils';
import { saveStudentProgress } from '../services/studentService';

interface GameContextType {
  user: User | any | null;
  profile: UserProfile | null;
  progress: UserProgress;
  loading: boolean;
  muted: boolean;
  darkMode: boolean; 
  showLevelUp: boolean;
  newBadge: Badge | null;
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  
  toggleMute: () => void;
  toggleDarkMode: () => void;
  playSound: (type: 'success' | 'error' | 'click' | 'fanfare' | 'levelup' | 'alarm') => void;
  updateProgress: (key: string, val: any) => Promise<void>;
  createProfile: (name: string, role: string, classCode?: string) => Promise<void>;
  dismissLevelUp: () => void;
  dismissBadge: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentXp, setCurrentXp] = useState(0);

  // Derived state
  const nextLevelXp = LEVELS.find(l => l.level === currentLevel + 1)?.minXp || 9999;

  // Initial Auth & Data Load
  useEffect(() => {
    // 1. Initialize Settings
    const storedMute = localStorage.getItem('app_muted') === 'true';
    setMuted(storedMute);

    const storedDark = localStorage.getItem('app_dark_mode') === 'true';
    setDarkMode(storedDark);
    if (storedDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // 2. Handle Mock Mode
    if (isMock) {
      const mockUid = localStorage.getItem('pas_mock_uid') || `mock-${Date.now()}`;
      localStorage.setItem('pas_mock_uid', mockUid);
      const mockUser = { uid: mockUid, isAnonymous: true };
      setUser(mockUser);

      const localProfile = localStorage.getItem(`pas_profile_${mockUid}`);
      if (localProfile) setProfile(JSON.parse(localProfile));

      const localProgress = localStorage.getItem(`pas_progress_${mockUid}`);
      if (localProgress) {
        const parsed = JSON.parse(localProgress);
        checkStreak(parsed, mockUid, true);
        setProgress(parsed);
        setCurrentXp(parsed.xp || 0);
        setCurrentLevel(parsed.level || 1);
      }
      setLoading(false);
      return;
    }

    // 3. Handle Real Firebase Auth
    const initAuth = async () => {
      try {
        // @ts-ignore
        if (typeof __initial_auth_token !== 'undefined') {
          // @ts-ignore
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth failed:", error);
      }
    };
    initAuth();

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'main'), (snap) => { 
            if (snap.exists()) setProfile(snap.data() as UserProfile); 
            else setProfile(null); 
        });
        const unsubProgress = onSnapshot(doc(db, 'artifacts', appId, 'users', u.uid, 'progress', 'main'), (snap) => { 
            if (snap.exists()) {
                const data = snap.data();
                checkStreak(data, u.uid, false);
                setProgress(data); 
                setCurrentXp(data.xp || 0);
                setCurrentLevel(data.level || 1);
            } else {
                setProgress({});
            }
            setLoading(false); 
        });
        return () => { unsubProfile(); unsubProgress(); };
      }
    });

    return () => unsubAuth();
  }, []);

  const checkStreak = async (currentProgress: any, uid: string, isMockMode: boolean) => {
    const today = new Date().toDateString();
    const lastLogin = currentProgress.lastLoginDate;
    
    if (lastLogin === today) return;

    let newStreak = currentProgress.streak || 0;
    if (lastLogin) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLogin === yesterday.toDateString()) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    const updates = { streak: newStreak, lastLoginDate: today };
    if (isMockMode) {
        const merged = { ...currentProgress, ...updates };
        localStorage.setItem(`pas_progress_${uid}`, JSON.stringify(merged));
        setProgress(merged); 
    } else {
        await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'progress', 'main'), updates, { merge: true });
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', uid), { progress: updates }, { merge: true });
    }
  };

  const playSound = useCallback((type: 'success' | 'error' | 'click' | 'fanfare' | 'levelup' | 'alarm') => {
    if (!muted) {
        playSoundUtil(type);
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    const newState = !muted;
    setMuted(newState);
    localStorage.setItem('app_muted', String(newState));
  }, [muted]);

  const toggleDarkMode = useCallback(() => {
    const newState = !darkMode;
    setDarkMode(newState);
    localStorage.setItem('app_dark_mode', String(newState));
    if (newState) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    playSound('click');
  }, [darkMode, playSound]);

  const updateProgress = async (key: string, val: any) => {
    if (!user) return;

    // 1. Calculate XP
    let xpGain = 0;
    if (key === 'examenCompleted' && val === true) xpGain = XP_REWARDS.EXAM_PASS;
    else if (key.endsWith('Completed') && val === true && !progress[key]) xpGain = XP_REWARDS.MODULE_COMPLETE;
    else if (typeof val === 'number') xpGain = val;

    // 2. Check for Badge Unlock
    let newlyUnlocked: Badge | null = null;
    if (key.endsWith('Completed') && val === true && !progress[key]) {
        const moduleId = key.replace('Completed', '');
        const badge = BADGE_DATA.find(b => b.id === moduleId);
        if (badge) {
            newlyUnlocked = badge;
            setNewBadge(badge); // Trigger modal
        }
    }

    // 3. Level Logic
    const newXp = (progress.xp || 0) + xpGain;
    let newLevel = progress.level || 1;
    const nextLevelConfig = LEVELS.find(l => l.level === newLevel + 1);
    
    // Prioritize Badge Sound over Level Up if both happen, or chain them
    if (nextLevelConfig && newXp >= nextLevelConfig.minXp) {
        newLevel++;
        setShowLevelUp(true);
        playSound(newlyUnlocked ? 'fanfare' : 'levelup');
    } else if (newlyUnlocked) {
        playSound('fanfare');
    }

    const newProg = { ...progress, xp: newXp, level: newLevel };
    if(typeof key === 'string') newProg[key] = val;

    // Optimistic update
    setProgress(newProg);
    setCurrentXp(newXp);
    setCurrentLevel(newLevel);

    if (isMock) {
        localStorage.setItem(`pas_progress_${user.uid}`, JSON.stringify(newProg));
    } else {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'main'), newProg, { merge: true });
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', user.uid), { progress: newProg }, { merge: true });
    }

        // Actualizar también en el sistema de estudiantes si el perfil existe
    if (profile) {
      await saveStudentProgress({
        studentId: user.uid,
        nombre: profile.name,
        clase: profile.classCode || '',
        rol: profile.role,
        fechaInicio: progress.lastLoginDate || new Date().toISOString(),
        ultimaActividad: new Date().toISOString(),
        actividadActual: key.replace('Completed', ''),
        moduloActual: newLevel,
        puntuacion: newXp,
        xp: newXp,
        nivel: newLevel,
        pasCompleted: newProg.pasCompleted || false,
        evaluacionCompleted: newProg.evaluacionCompleted || false,
        svbCompleted: newProg.svbCompleted || false,
        traumasCompleted: newProg.traumasCompleted || false,
        examenCompleted: newProg.examenCompleted || false,
        tiempoTotal: 0,
        intentosExamen: 0,
        racha: newProg.streak || 0,
        progreso: newProg
      });
    }
  };

  
  
      // También guardar en el sistema de estudiantes
    await saveStudentProgress({
      studentId: user.uid,
      nombre: name,
      clase: classCode,
      rol: role,
      fechaInicio: new Date().toISOString(),
      ultimaActividad: new Date().toISOString(),
      actividadActual: 'inicio',
      moduloActual: 0,
      puntuacion: 0,
      xp: 0,
      nivel: 1,
      pasCompleted: false,
      evaluacionCompleted: false,
      svbCompleted: false,
      traumasCompleted: false,
      examenCompleted: false,
      tiempoTotal: 0,
      intentosExamen: 0,
      racha: 1,
      progreso: initProgress
    });= async (name: string, role: string, classCode: string = '') => {
    if (!user) return;
    const data = { name, role, classCode: classCode.toUpperCase() };
    const initProgress = { xp: 0, level: 1, streak: 1, lastLoginDate: new Date().toDateString() };

    if (isMock) {
        localStorage.setItem(`pas_profile_${user.uid}`, JSON.stringify(data));
        setProfile(data as UserProfile);
        localStorage.setItem(`pas_progress_${user.uid}`, JSON.stringify(initProgress));
        setProgress(initProgress);
    } else {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), data);
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'main'), initProgress, {merge: true});
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', user.uid), { userId: user.uid, ...data, lastUpdate: new Date().toISOString(), progress: initProgress });
    }
  };

  const dismissLevelUp = () => setShowLevelUp(false);
  const dismissBadge = () => setNewBadge(null);

  return (
    <GameContext.Provider value={{
      user, profile, progress, loading, muted, darkMode,
      showLevelUp, newBadge, currentLevel, currentXp, nextLevelXp,
      toggleMute, toggleDarkMode, playSound, updateProgress, createProfile, dismissLevelUp, dismissBadge
    }}>
      {children}
    </GameContext.Provider>
  );
};
