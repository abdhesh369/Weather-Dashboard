import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CloudLightning, Wind, Thermometer, ChevronDown, ChevronUp, X } from 'lucide-react';

const SEVERITY = {
  extreme:  { color: '#f87171', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.22)',  Icon: CloudLightning },
  severe:   { color: '#fb923c', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.22)', Icon: AlertTriangle  },
  moderate: { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.22)', Icon: Wind           },
  minor:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.18)', Icon: Thermometer    },
};

function getSeverity(alert) {
  const ev = (alert.event ?? '').toLowerCase();
  const sv = (alert.severity ?? '').toLowerCase();
  if (sv === 'extreme'  || ev.includes('extreme') || ev.includes('tornado') || ev.includes('hurricane')) return 'extreme';
  if (sv === 'severe'   || ev.includes('severe')  || ev.includes('storm')   || ev.includes('blizzard'))  return 'severe';
  if (sv === 'moderate' || ev.includes('warning')) return 'moderate';
  return 'minor';
}

function AlertItem({ alert, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const sev = getSeverity(alert);
  const { color, bg, border, Icon } = SEVERITY[sev];
  const isUrgent = sev === 'extreme' || sev === 'severe';

  const description = alert.description ?? '';
  const preview     = description.slice(0, 140).trim();
  const hasMore     = description.length > 140;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0,  height: 'auto' }}
      exit={{   opacity: 0, y: -4,  height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[20px] border"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex items-start gap-3 px-5 py-4">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUrgent ? 'animate-pulse' : ''}`}
          style={{ background: `${color}22`, boxShadow: isUrgent ? `0 0 12px ${color}44` : 'none' }}
        >
          <Icon size={16} style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-white leading-tight mb-0.5">
            {alert.event ?? 'Weather Alert'}
          </p>

          {alert.sender_name && (
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: `${color}99` }}>
              {alert.sender_name}
            </p>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={expanded ? 'full' : 'preview'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.58)' }}
            >
              {expanded ? description : preview}
              {!expanded && hasMore && '…'}
            </motion.p>
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 mt-1.5 text-[11px] font-bold border-none bg-transparent cursor-pointer transition-colors"
              style={{ color }}
            >
              {expanded ? <><ChevronUp size={11} /> Show less</> : <><ChevronDown size={11} /> Read more</>}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(alert)}
          className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-all shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e  => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e  => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          aria-label="Dismiss alert"
        >
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}

export default function AlertsBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState(new Set());

  const visible = alerts.filter(a => !dismissed.has(a.event + (a.start ?? '')));
  if (visible.length === 0) return null;

  const dismiss = (alert) => {
    setDismissed(prev => new Set([...prev, alert.event + (alert.start ?? '')]));
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="flex flex-col gap-2">
        {visible.map((alert, i) => (
          <AlertItem
            key={alert.event + i}
            alert={alert}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
