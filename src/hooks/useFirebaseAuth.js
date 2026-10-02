import { useState, useEffect, useRef, useCallback } from 'react';
import {
  onAuthStateChanged, signInWithCustomToken, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from 'firebase/auth';
import {
  doc, onSnapshot, setDoc, getDoc, updateDoc, increment,
  collection, query, where, getDocs
} from 'firebase/firestore';

export function useFirebaseAuth(db, auth, appId, addToast, confetti) {
  const [user, setUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0, level: 1, examAttempts: [],
    inventory: { avatars: ['default'], themes: [], powerups: {}, titles: ['novice'] },
    activeAvatar: 'default', activeTheme: 'default', activeTitle: 'novice',
    dailyStats: {
      date: new Date().toDateString(), modulesCompleted: 0, xpEarned: 0,
      guardiaPlayed: 0, correctAnswers: 0, glossaryViews: 0
    },
    dailyQuests: null, failedQuestions: [], masteredQuestions: []
  });
  const progressRef = useRef(progress);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.isAnonymous) { signOut(auth); return; }
        setUser(u);

        const unsubProfile = onSnapshot(
          doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'main'),
          (snap) => {
            if (snap.exists()) {
              const profileData = snap.data();
              setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', u.uid), {
                userId: u.uid, name: profileData.name || u.displayName || 'Estudiante',
                lastUpdate: new Date().toISOString()
              }, { merge: true }).catch(err => console.log("Sync warning", err));
              setIsBlocked(!!profileData.blocked);
              setProfile(profileData);
            } else {
              setProfile(null);
            }
          }
        );

        const unsubProgress = onSnapshot(
          doc(db, 'artifacts', appId, 'users', u.uid, 'progress', 'main'),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setProgress(data);
              setCurrentStreak(data.streak || 0);

              const today = new Date().toISOString().slice(0, 10);
              if (data.lastLoginDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().slice(0, 10);

                let newStreak = 1;
                let streakSaved = false;
                const updates = { lastLoginDate: today };

                if (data.lastLoginDate === yesterdayStr) {
                  newStreak = (data.streak || 0) + 1;
                } else {
                  const freezeCount = data.inventory?.powerups?.streak_freeze || 0;
                  if ((data.streak || 0) > 0 && freezeCount > 0) {
                    newStreak = (data.streak || 0);
                    streakSaved = true;
                    updates['inventory.powerups.streak_freeze'] = freezeCount - 1;
                  }
                }

                const todayDate = new Date();
                if (todayDate.getDay() === 1) {
                  updates.weeklyXP = 0;
                  if (data.weeklyXP > 0) updates.lastWeekXP = data.weeklyXP;
                  updates.weeklyStats = null;
                  updates.weeklyQuests = null;
                }

                updates.streak = newStreak;

                const currentBadges = data.badges || [];
                const newBadges = [...currentBadges];
                if (newStreak >= 3 && !newBadges.includes('streak_3')) {
                  newBadges.push('streak_3');
                  if (addToast) addToast("¡Insignia Desbloqueada!", 'success');
                  if (confetti) confetti();
                }
                if (newStreak >= 7 && !newBadges.includes('streak_7')) {
                  newBadges.push('streak_7');
                  if (addToast) addToast("¡Insignia Desbloqueada!", 'success');
                  if (confetti) confetti();
                }
                updates.badges = newBadges;

                setDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'progress', 'main'), updates, { merge: true });
                if (streakSaved && addToast) {
                  addToast("¡Racha salvada por el Hielo!", 'info');
                }
              }
            } else {
              setProgress({});
            }
            setLoading(false);
          }
        );

        return () => { unsubProfile(); unsubProgress(); };
      } else {
        setUser(null);
        setProfile(null);
        setProgress({});
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, [db, auth, appId, addToast, confetti]);

  const handleAuth = useCallback(async (formData, isRegister) => {
    if (isRegister) {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const u = userCredential.user;
      const data = { name: formData.name, role: formData.role, email: formData.email };
      await setDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'main'), data);
      const initProgress = { xp: 0, level: 1 };
      await setDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'progress', 'main'), initProgress, { merge: true });
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', u.uid), {
        userId: u.uid, name: formData.name, role: formData.role, lastUpdate: new Date().toISOString(), progress: initProgress
      });
    } else {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    }
  }, [db, auth, appId]);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  return { user, profile, setProfile, progress, setProgress, progressRef, loading, isBlocked, currentStreak, setCurrentStreak, handleAuth, handleLogout };
}
