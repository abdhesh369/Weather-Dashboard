import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const CONFIG = {
  success: { Icon: CheckCircle, color: '#4ade80', border: 'rgba(74,222,128,0.25)',  bg: 'rgba(74,222,128,0.08)'  },
  error:   { Icon: AlertCircle, color: '#f87171', border: 'rgba(248,113,113,0.25)', bg: 'rgba(248,113,113,0.08)' },
  warning: { Icon: AlertTriangle, color: '#fbbf24', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.08)' },
  info:    { Icon: Info,         color: '#60a5fa', border: 'rgba(96,165,250,0.25)',  bg: 'rgba(96,165,250,0.08)'  },
};

function ProgressBar({ duration, color }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 h-[2px] rounded-b-[14px]"
      style={{ background: color }}
      initial={{ width: '100%' }}
      animate={{ width: '0%' }}
      transition={{ duration: duration / 1000, ease: 'linear' }}
    />
  );
}

function Toast({ toast, onRemove, duration }) {
  const { Icon, color, border, bg } = CONFIG[toast.type] ?? CONFIG.info;

  // Pause-on-hover timer
  const timerRef    = useRef(null);
  const startRef    = useRef(Date.now());
  const remainRef   = useRef(duration);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), remainRef.current);
    return () => clearTimeout(timerRef.current);
  }, []);

  const pause = () => {
    clearTimeout(timerRef.current);
    remainRef.current -= Date.now() - startRef.current;
  };
  const resume = () => {
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => onRemove(toast.id), remainRef.current);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.94, x: 20 }}
      animate={{ opacity: 1, y: 0,  scale: 1,    x: 0  }}
      exit   ={{ opacity: 0, y: 8,  scale: 0.96, x: 30 }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      role="alert"
      onMouseEnter={pause}
      onMouseLeave={resume}
      className="relative flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-[14px] overflow-hidden pointer-events-auto cursor-default"
      style={{
        background:    `rgba(10,15,35,0.96)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border:  `1px solid ${border}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.5), inset 0 0 0 1px ${bg}`,
        minWidth: 240,
        maxWidth: 360,
      }}
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]" style={{ background: color }} />

      <Icon size={15} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <span className="text-[13px] font-medium text-white flex-1 leading-snug pr-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-full border-none cursor-pointer transition-colors hover:bg-white/8 flex-shrink-0 self-start"
        style={{ color: 'rgba(255,255,255,0.35)', background: 'transparent' }}
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>

      <ProgressBar duration={duration} color={color} />
    </motion.div>
  );
}

export function ToastContainer({ toasts, onRemove, duration = 3800 }) {
  return (
    <div
      className="fixed bottom-6 right-4 md:right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.slice(-5).map(t => (
          <Toast key={t.id} toast={t} onRemove={onRemove} duration={duration} />
        ))}
      </AnimatePresence>
    </div>
  );
}
