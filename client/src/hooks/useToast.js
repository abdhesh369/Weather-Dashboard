import { useState, useCallback, useRef } from 'react';

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 3800;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = DEFAULT_DURATION) => {
    // Deduplicate: if same message+type already visible, just reset timer
    setToasts(prev => {
      const existing = prev.find(t => t.message === message && t.type === type);
      if (existing) {
        clearTimeout(timers.current.get(existing.id));
        timers.current.set(existing.id, setTimeout(() => removeToast(existing.id), duration));
        return prev;
      }

      const id = `${Date.now()}-${Math.random()}`;

      // Cap stack at MAX_TOASTS — evict oldest
      const next = [...prev, { id, message, type }].slice(-MAX_TOASTS);

      timers.current.set(id, setTimeout(() => removeToast(id), duration));
      return next;
    });
  }, [removeToast]);

  return { toasts, addToast, removeToast };
}
