import { useCallback } from 'react';

export function useStore(progress, updateProgress, addToast, playSound, lang) {

  const handleStorePurchase = useCallback(async (category, item) => {
    const currentXp = progress.xp || 0;
    if (currentXp < item.price) {
      addToast(lang === 'en' ? 'Not enough XP!' : '¡No tienes suficiente XP!', 'error');
      return;
    }

    try {
      const updates = { xpGain: -item.price };

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
      } else if (category === 'titles') {
        const currentTitles = progress.inventory?.titles || ['novice'];
        if (!currentTitles.includes(item.id)) {
          updates['inventory.titles'] = [...currentTitles, item.id];
        } else {
          addToast(lang === 'en' ? 'Already owned!' : '¡Ya tienes este título!', 'info');
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
  }, [progress, updateProgress, addToast, playSound, lang]);

  const handleBuyAvatar = useCallback((avatar) => {
    handleStorePurchase('avatars', avatar);
  }, [handleStorePurchase]);

  return { handleStorePurchase, handleBuyAvatar };
}
