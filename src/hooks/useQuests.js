import { useCallback } from 'react';

export function useQuests(updateProgress, addToast, confetti, playSound) {

  const handleClaimQuestReward = useCallback(async (totalReward, type = 'daily') => {
    try {
      const bonusReward = type === 'weekly' ? 100 : 50;
      const finalReward = totalReward + bonusReward;

      const updates = { xpGain: finalReward };

      if (type === 'weekly') {
        updates['weeklyQuests.claimed'] = true;
        addToast(`¡Misiones Semanales completadas! +${finalReward} XP`, 'success');
      } else {
        updates['dailyQuests.claimed'] = true;
        addToast(`¡Misiones Diarias completadas! +${finalReward} XP`, 'success');
      }

      await updateProgress(updates);
      confetti();
      playSound('success');
    } catch (e) {
      console.error('Quest reward error:', e);
      addToast('Error al reclamar recompensa', 'error');
    }
  }, [updateProgress, addToast, confetti, playSound]);

  return { handleClaimQuestReward };
}
