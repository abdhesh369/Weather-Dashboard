import { useEffect, useCallback } from 'react';

/**
 * Global keyboard shortcuts for the app.
 * Ignores keypresses inside inputs/textareas/selects.
 */
export function useKeyboardShortcuts({ onFocusSearch, onLocate, onToggleUnits }) {
  const isTyping = useCallback(() => {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      // Always allow Escape to blur inputs
      if (e.key === 'Escape') {
        document.activeElement?.blur();
        return;
      }

      if (isTyping()) return;

      // Ignore when modifier keys are held (avoid clashing with browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          onFocusSearch?.();
          break;
        case 'g':
        case 'G':
          onLocate?.();
          break;
        case 'u':
        case 'U':
          onToggleUnits?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isTyping, onFocusSearch, onLocate, onToggleUnits]);
}
