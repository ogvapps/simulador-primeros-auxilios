import { useEffect } from 'react';

export function useKeyboard(keyMap) {
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (keyMap[key]) {
        if (key === 'Escape' || key === 'Enter') {
          e.preventDefault();
        }
        keyMap[key](e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap]);
}
