import { motion } from 'framer-motion';

const UV_LEVELS = [
  { max: 2,  label: 'Low',       color: '#4ade80', bg: 'rgba(74,222,128,0.10)',  spf: null,     burnMins: null,      advice: 'No protection needed. Enjoy the outdoors.' },
  { max: 5,  label: 'Moderate',  color: '#facc15', bg: 'rgba(250,204,21,0.10)',  spf: 'SPF 15', burnMins: '30–45',   advice: 'Wear sunscreen if outside for 30+ min.' },
  { max: 7,  label: 'High',      color: '#fb923c', bg: 'rgba(251,146,60,0.10)',  spf: 'SPF 30', burnMins: '20–30',   advice: 'Cover up, wear a hat and sunglasses.' },
  { max: 10, label: 'Very High', color: '#f87171', bg: 'rgba(248,113,113,0.10)', spf: 'SPF 50', burnMins: '10–15',   advice: 'Seek shade. Avoid outdoors 10am–4pm.' },
  { max: Infinity, label: 'Extreme', color: '#c084fc', bg: 'rgba(192,132,252,0.10)', spf: 'SPF 50+', burnMins: '<10', advice: 'Stay indoors if possible. Extreme burn risk.' },
];

function getLevel(uv) {
  return UV_LEVELS.find(l => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];
}

const PROTECTION_ICONS = [
  { icon: '🕶', label: 'Sunglasses', threshold: 3 },
  { icon: '🧴', label: 'Sunscreen',  threshold: 3 },
  { icon: '🧢', label: 'Hat',        threshold: 6 },
  { icon: '👕', label: 'Cover up',   threshold: 8 },
];

export default function UVCard({ uv = 0 }) {
  const idx   = Math.min(Math.max(Math.round(uv), 0), 11);
  const level = getLevel(uv);
  const pct   = Math.min((idx / 11) * 100, 97);

  const activeProtections = PROTECTION_ICONS.filter(p => uv >= p.threshold);

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '36px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">UV Index</p>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
          style={{ color: level.color, borderColor: `${level.color}44`, background: level.bg }}
        >
          {level.label}
        </motion.span>
      </div>

      {/* Big number */}
      <div className="flex items-end gap-3">
        <motion.span
          key={uv}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[44px] font-bold leading-none"
          style={{ color: level.color, textShadow: `0 0 20px ${level.color}44` }}
        >
          {Math.round(uv * 10) / 10}
        </motion.span>
        <div className="flex flex-col gap-0.5 mb-1.5">
          {level.spf && (
            <span className="text-[12px] font-bold text-white/60">Wear {level.spf}</span>
          )}
          {level.burnMins && (
            <span className="text-[11px] font-medium text-white/40">Burns in ~{level.burnMins} min</span>
          )}
        </div>
      </div>

      {/* Colour-banded gauge */}
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{ background: 'linear-gradient(90deg,#4ade80 0%,#facc15 25%,#fb923c 50%,#f87171 75%,#c084fc 100%)' }}
      >
        <motion.div
          className="absolute top-1/2 w-4 h-4 rounded-full border-[3px]"
          style={{
            left: `${pct}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            background: '#fff',
            borderColor: '#0a0f1e',
            boxShadow: `0 0 8px ${level.color}88`,
          }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between -mt-1.5">
        {['0', '3', '6', '8', '11+'].map(l => (
          <span key={l} className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</span>
        ))}
      </div>

      {/* Advice */}
      <p className="text-[12px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {level.advice}
      </p>

      {/* Protection checklist */}
      {activeProtections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeProtections.map(p => (
            <div
              key={p.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
            >
              <span>{p.icon}</span> {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
