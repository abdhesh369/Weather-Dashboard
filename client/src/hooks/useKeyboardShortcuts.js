import { useEffect } from 'react';

export function useKeyboardShortcuts({ onFocusSearch, onLocate, onToggleUnits }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if currently typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (e.key === 'Escape') {
              e.target.blur();
          }
          return;
      }

      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch();
      }

      if (e.key.toLowerCase() === 'l') {
        onLocate();
      }

      if (e.key.toLowerCase() === 'u') {
        onToggleUnits();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusSearch, onLocate, onToggleUnits]);
}
