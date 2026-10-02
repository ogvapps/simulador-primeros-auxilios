import { useCallback } from 'react';
import { updateStreak } from '../utils/streakSystem';

export function useExamCompletion(progress, updateProgress, addToast, playSound, confetti, t, XP_REWARDS, setShowStreakCelebration, setCurrentStreak) {

  const handleExamAnswer = useCallback((currentStreak, isCorrect) => {
    const { newStreak, milestone } = updateStreak(currentStreak, isCorrect);
    setCurrentStreak(newStreak);

    const updates = {
      currentStreak: newStreak,
      'dailyStats.correctAnswers': (progress.dailyStats?.correctAnswers || 0) + (isCorrect ? 1 : 0),
      'weeklyStats.correctAnswers': (progress.weeklyStats?.correctAnswers || 0) + (isCorrect ? 1 : 0)
    };

    if (milestone) {
      setShowStreakCelebration(milestone.count);
      playSound('fanfare');
      if (milestone.xp) {
        updates.xpGain = milestone.xp;
        addToast(`+${milestone.xp} XP - ${milestone.name}!`, 'success');
      }
    }
    updateProgress(updates);
  }, [progress, updateProgress, addToast, playSound, setShowStreakCelebration, setCurrentStreak]);

  const handleExamComplete = useCallback((randomizedExamQuestions, rawScore, passed, answers, insuranceUsed, xpMultiplier = 1) => {
    const qCount = randomizedExamQuestions ? randomizedExamQuestions.length : 40;
    const baseGrade = (rawScore / qCount) * 10;

    const currentAttemptsData = progress.examAttempts || 0;
    const attemptCount = Array.isArray(currentAttemptsData) ? currentAttemptsData.length : (Number(currentAttemptsData) || 0);
    const maxGradeAllowed = Math.max(5, 10 - attemptCount);

    let finalGrade = Math.min(baseGrade, maxGradeAllowed);
    finalGrade = Math.max(0, finalGrade);

    const isApproved = finalGrade >= 5;

    const oldAttempts = Array.isArray(progress.examAttempts) ? progress.examAttempts : [];
    let newAttempts = [...oldAttempts];
    let attemptAdded = false;

    if (!(!isApproved && insuranceUsed)) {
      newAttempts.push({
        score: rawScore, grade: finalGrade, passed: isApproved,
        answers,
        date: new Date().toISOString(),
        type: 'normal'
      });
      attemptAdded = true;
    } else {
      playSound('powerup');
    }

    const remapAnswers = (answers, questions) => {
      if (answers && questions) {
        const globalAnswers = {};
        Object.entries(answers).forEach(([localIdx, ans]) => {
          const q = questions[localIdx];
          if (q && q._originalIndex !== undefined) {
            globalAnswers[q._originalIndex] = ans;
          }
        });
        return globalAnswers;
      }
      return answers;
    };

    if (isApproved) {
      const updates = {
        examenPassed: true, examenCompleted: true,
        examAttempts: newAttempts,
        examenScore: finalGrade.toFixed(2)
      };
      const globalAnswers = remapAnswers(answers, randomizedExamQuestions);
      updates.examAnswers = globalAnswers;
      if (attemptAdded && globalAnswers !== answers) {
        newAttempts[newAttempts.length - 1].answers = globalAnswers;
      }

      updateProgress(updates, null, xpMultiplier);
      if (xpMultiplier > 1) addToast("¡XP DOBLE ACTIVADO!", 'success');
      playSound('success');
      confetti();
    } else {
      const updates = {
        examAttempts: newAttempts,
        examenScore: finalGrade.toFixed(2)
      };
      const globalAnswers = remapAnswers(answers, randomizedExamQuestions);
      updates.examAnswers = globalAnswers;
      if (attemptAdded && globalAnswers !== answers) {
        newAttempts[newAttempts.length - 1].answers = globalAnswers;
      }

      updateProgress(updates);
    }
  }, [progress, updateProgress, addToast, playSound, confetti]);

  const handleSurpriseExamComplete = useCallback((surpriseExam, rawScore, passed, answers) => {
    const xpMultiplier = surpriseExam.xpMultiplier || 1;
    const xpGain = passed ? XP_REWARDS.EXAM_PASS : 50;

    let globalAnswers = answers;
    if (answers && surpriseExam.questions) {
      globalAnswers = {};
      Object.entries(answers).forEach(([localIdx, ans]) => {
        const q = surpriseExam.questions[localIdx];
        if (q && q._originalIndex !== undefined) {
          globalAnswers[q._originalIndex] = ans;
        }
      });
    }

    const qCount = surpriseExam.questions?.length || 20;
    const grade = (rawScore / qCount) * 10;
    const oldAttempts = Array.isArray(progress.examAttempts) ? progress.examAttempts : [];
    const newAttempts = [...oldAttempts, {
      score: rawScore, grade, passed,
      answers: globalAnswers, type: 'surprise',
      date: new Date().toISOString()
    }];

    updateProgress({ surpriseExamXP: xpGain, examAttempts: newAttempts }, null, xpMultiplier);

    const displayXp = passed ? (XP_REWARDS.EXAM_PASS * xpMultiplier) : 50;
    addToast(passed
      ? (t?.exam?.passed || '¡Examen Sorpresa Aprobado! +' + displayXp + ' XP')
      : (t?.exam?.completed || 'Examen Sorpresa Completado +' + 50 + ' XP'),
      passed ? 'success' : 'info');
  }, [progress, updateProgress, addToast, t, XP_REWARDS]);

  return { handleExamAnswer, handleExamComplete, handleSurpriseExamComplete };
}
