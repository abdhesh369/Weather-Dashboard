import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICON = {
  success: <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0 }} />,
  error:   <AlertCircle size={15} style={{ color: '#f87171', flexShrink: 0 }} />,
  info:    <Info        size={15} style={{ color: '#60a5fa', flexShrink: 0 }} />,
};

const BORDER = {
  success: 'rgba(74,222,128,0.25)',
  error:   'rgba(248,113,113,0.25)',
  info:    'rgba(96,165,250,0.25)',
};

function Toast({ toast, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit   ={{ opacity: 0, y: 8,  scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      role="alert"
      className="flex items-center gap-2.5 pl-3.5 pr-3 py-3 rounded-[14px] pointer-events-auto"
      style={{
        background: 'rgba(10,15,35,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${BORDER[toast.type] ?? 'rgba(255,255,255,0.1)'}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        minWidth: 220,
        maxWidth: 340,
      }}
    >
      {ICON[toast.type] ?? ICON.info}
      <span className="text-[13px] font-medium text-white flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 rounded-full border-none cursor-pointer transition-all duration-150"
        style={{ background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
