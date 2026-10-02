import { useState, useCallback, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';

export function useXPProgression(db, appId, user, profile, progressRef, setProgress, progress, LEVELS, XP_REWARDS, addToast, playSound, confetti, t) {
  const [isSaving, setIsSaving] = useState(false);
  const [currentXp, setCurrentXp] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (progress) {
      setCurrentXp(progress.xp || 0);
      setCurrentLevel(progress.level || 1);
    }
  }, [progress]);

  const updateProgress = useCallback(async (keyOrChanges, val, multiplier = 1) => {
    setIsSaving(true);
    try {
      const changes = typeof keyOrChanges === 'object' ? keyOrChanges : { [keyOrChanges]: val };
      let updated = { ...progressRef.current };

      Object.entries(changes).forEach(([key, value]) => {
        let xpGain = 0;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        } else if (key === 'examenCompleted' && value === true) {
          xpGain = XP_REWARDS.EXAM_PASS;
        } else if (key.endsWith('Completed') && value === true && !updated[key]) {
          xpGain = XP_REWARDS.MODULE_COMPLETE;
        } else if (key === 'xp') {
          xpGain = (value - (updated.xp || 0)) / multiplier;
        } else if (key === 'xpGain' || key === 'additionalXp' || key === 'practiceXpGain' || key === 'surpriseExamXP' || key === 'guardiaXp') {
          xpGain = value;
        }

        const currentXpVal = updated.xp || 0;
        const currentLifetimeXp = updated.lifetimeXp !== undefined ? updated.lifetimeXp : currentXpVal;
        const currentWeeklyXP = updated.weeklyXP || 0;

        let newXp = currentXpVal + (xpGain * multiplier);
        let newLifetimeXp = currentLifetimeXp;
        let newWeeklyXP = currentWeeklyXP;

        if (xpGain > 0) {
          newLifetimeXp += (xpGain * multiplier);
          newWeeklyXP += (xpGain * multiplier);
        }

        let newLevel = updated.level || 1;
        let leveledUp = false;
        while (true) {
          const nextLevelConfig = LEVELS.find(l => l.level === newLevel + 1);
          if (nextLevelConfig && newLifetimeXp >= nextLevelConfig.minXp) {
            newLevel++;
            leveledUp = true;
          } else {
            break;
          }
        }

        if (leveledUp) {
          setShowLevelUp(true);
          playSound('levelup');
          addToast(t?.toasts?.levelUp || `¡Nivel ${newLevel} Desbloqueado!`, 'success');
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#EF4444'], zIndex: 9999 });
          setTimeout(() => setShowLevelUp(false), 4000);
        }

        updated = { ...updated, xp: newXp, lifetimeXp: newLifetimeXp, weeklyXP: newWeeklyXP, level: newLevel };

        if (xpGain > 0 || changes.dailyStats) {
          const today = new Date().toDateString();
          const currentStats = updated.dailyStats || {};
          const currentWeeklyStats = updated.weeklyStats || {};

          let newDailyStats = { ...currentStats };
          if (currentStats.date !== today) {
            newDailyStats = {
              date: today, modulesCompleted: 0, xpEarned: 0,
              guardiaPlayed: 0, correctAnswers: 0, glossaryViews: 0
            };
          }
          const finalGain = (xpGain > 0 ? xpGain * multiplier : 0);
          newDailyStats.xpEarned = (newDailyStats.xpEarned || 0) + finalGain;

          let newWeeklyStats = { ...currentWeeklyStats };
          newWeeklyStats.xpEarned = (newWeeklyStats.xpEarned || 0) + finalGain;

          updated.dailyStats = newDailyStats;
          updated.weeklyStats = newWeeklyStats;
        }

        if (typeof key === 'string' && key.includes('.')) {
          const parts = key.split('.');
          let currentObj = updated;
          for (let i = 0; i < parts.length - 1; i++) {
            currentObj[parts[i]] = currentObj[parts[i]] ? { ...currentObj[parts[i]] } : {};
            currentObj = currentObj[parts[i]];
          }
          currentObj[parts[parts.length - 1]] = value;
        } else {
          updated[key] = value;
        }
      });

      setProgress(updated);
      setCurrentXp(updated.xp);
      setCurrentLevel(updated.level);

      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'main'), updated, { merge: true });
      const summaryRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', user.uid);
      await setDoc(summaryRef, {
        progress: updated,
        lastUpdate: new Date().toISOString(),
        name: profile?.name || user.displayName || 'Estudiante',
        email: user.email
      }, { merge: true });

    } catch (error) {
      console.error("Error updating progress:", error);
      addToast('Error saving progress', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [db, appId, user, profile, progressRef, setProgress, LEVELS, XP_REWARDS, addToast, playSound, confetti, t]);

  return { updateProgress, isSaving, setIsSaving, currentXp, setCurrentXp, currentLevel, setCurrentLevel, showLevelUp };
}
