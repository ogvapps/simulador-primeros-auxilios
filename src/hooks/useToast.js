import { useState, useCallback } from 'react';

export function useToast(playSound) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    if (playSound) {
      if (type === 'success') playSound('success');
      else if (type === 'error') playSound('error');
      else playSound('click');
    }
  }, [playSound]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
