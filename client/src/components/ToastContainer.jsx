import React from 'react';

function Toast({ toast, onRemove }) {
  const colors = {
    success: 'var(--color-background-success)',
    error: 'var(--color-background-danger)',
    info: 'var(--color-background-info)',
  };

  return (
    <div
      style={{
        background: colors[toast.type] || colors.info,
        color: 'white',
        border: '1px solid var(--color-border-secondary)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        minWidth: '260px',
        maxWidth: '380px',
        animation: 'toastIn 0.2s ease',
      }}
      role="alert"
    >
      <span style={{ fontSize: '14px' }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.8)', fontSize: '18px',
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }} aria-live="polite">
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {toasts.map((t) => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  );
}
鼓
