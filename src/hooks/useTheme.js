import { useState, useEffect, useCallback } from 'react';

export function useTheme(progress, storeItems) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('app_dark') === 'true');

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('app_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const activeThemeId = progress?.activeTheme || 'default';
    const theme = storeItems?.themes?.find(t => t.id === activeThemeId);
    const root = document.documentElement;

    if (theme?.colors) {
      root.style.setProperty('--brand-500', theme.colors.primary);
      root.style.setProperty('--brand-600', theme.colors.primary);
      root.style.setProperty('--brand-700', theme.colors.secondary);
    } else {
      root.style.setProperty('--brand-50', '#f5f3ff');
      root.style.setProperty('--brand-500', '#8b5cf6');
      root.style.setProperty('--brand-600', '#7c3aed');
      root.style.setProperty('--brand-700', '#6d28d9');
    }
  }, [progress?.activeTheme, storeItems]);

  return { darkMode, toggleDarkMode };
}
