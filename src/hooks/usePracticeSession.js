import { useCallback } from 'react';

export function usePracticeSession(progress, updateProgress, practiceMode, addToast, confetti) {

  const handlePracticeAnswer = useCallback((isCorrect, sessionCount, questionData, streakCount) => {
    const updates = {};
    if (isCorrect) {
      updates['dailyStats.correctAnswers'] = (progress.dailyStats?.correctAnswers || 0) + 1;
      updates['weeklyStats.correctAnswers'] = (progress.weeklyStats?.correctAnswers || 0) + 1;

      const streakMultiplier = streakCount >= 10 ? 1.4 : 1;
      const modeMultiplier = practiceMode === 'survival' ? 2 : 1;
      const totalMultiplier = streakMultiplier * modeMultiplier;

      if (sessionCount === 20 && practiceMode !== 'survival') {
        updates.practiceXpGain = Math.round(100 * totalMultiplier);
        addToast("¡Meta alcanzada! +100 XP extra desbloqueados", 'success');
        confetti();
      } else if (sessionCount > 20 || practiceMode === 'survival') {
        updates.practiceXpGain = Math.round(5 * totalMultiplier);
      }

      if (questionData && questionData.q) {
        const currentMastered = progress.masteredQuestions || [];
        if (!currentMastered.includes(questionData.q)) {
          updates.masteredQuestions = [...currentMastered, questionData.q];
        }
        const currentFailed = progress.failedQuestions || [];
        if (currentFailed.includes(questionData.q)) {
          updates.failedQuestions = currentFailed.filter(q => q !== questionData.q);
        }
      }
    } else {
      if (questionData && questionData.q) {
        const currentFailed = progress.failedQuestions || [];
        if (!currentFailed.includes(questionData.q)) {
          updates.failedQuestions = [...currentFailed, questionData.q];
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      updateProgress(updates);
    }
  }, [progress, updateProgress, practiceMode, addToast, confetti]);

  return { handlePracticeAnswer };
}
