import { motion } from 'framer-motion';

function parseTimeStr(str) {
  if (!str) return null;
  const [h, m] = str.split(':').map(Number);
  if (isNaN(h)) return null;
  const d = new Date();
  d.setHours(h, m || 0, 0, 0);
  return d;
}

function fmtDuration(ms) {
  if (ms <= 0) return '—';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export default function SunCard({ sunrise, sunset }) {
  const now   = new Date();
  const rise  = parseTimeStr(sunrise);
  const set   = parseTimeStr(sunset);

  const hasTimes = rise && set;
  const total    = hasTimes ? set - rise : 0;
  const elapsed  = hasTimes ? Math.max(0, Math.min(now - rise, total)) : 0;
  const pct      = total > 0 ? elapsed / total : 0;
  const isDaytime = hasTimes && now >= rise && now <= set;

  // SVG arc geometry
  const R = 36; const cx = 50; const cy = 48;
  const angle = Math.PI - pct * Math.PI;
  const sunX  = (cx + R * Math.cos(angle)).toFixed(1);
  const sunY  = (cy - R * Math.sin(angle)).toFixed(1);

  // Progress path (partial arc from left to sun position)
  const startX = (cx - R).toFixed(1);
  const progressLarge = pct > 0.5 ? 1 : 0;
  const progressPath  = hasTimes && pct > 0
    ? `M ${startX} ${cy} A ${R} ${R} 0 ${progressLarge} 1 ${sunX} ${sunY}`
    : '';

  const daylightMs = hasTimes ? set - rise : 0;

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '40px' }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Sun</p>
        {hasTimes && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: isDaytime ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.12)',
                     color: isDaytime ? '#fbbf24' : 'rgba(165,180,252,0.8)' }}>
            {isDaytime ? '☀ Daytime' : '🌙 Nighttime'}
          </span>
        )}
      </div>

      <svg viewBox="0 0 100 56" fill="none" className="w-full" style={{ height: 72 }}>
        {/* Track arc */}
        <path
          d={`M 14 ${cy} A ${R} ${R} 0 0 1 86 ${cy}`}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 5"
        />
        {/* Progress arc */}
        {progressPath && (
          <path
            d={progressPath}
            stroke="url(#sunGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>
        {/* Horizon line */}
        <line x1="10" y1={cy} x2="90" y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {hasTimes && (
          <>
            {/* Glow ring */}
            <motion.circle
              cx={sunX} cy={sunY} r="10"
              fill="rgba(251,191,36,0.18)"
              animate={{ r: [10, 14, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Sun body */}
            <circle
              cx={sunX} cy={sunY} r="5.5"
              fill={isDaytime ? '#fbbf24' : '#f59e0b'}
              style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.9))' }}
            />
          </>
        )}

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const a = Math.PI - t * Math.PI;
          const tx = (cx + (R + 7) * Math.cos(a)).toFixed(1);
          const ty = (cy - (R + 7) * Math.sin(a)).toFixed(1);
          return <circle key={i} cx={tx} cy={ty} r="1.2" fill="rgba(255,255,255,0.15)" />;
        })}
      </svg>

      <div className="flex justify-between items-end">
        {[['🌅', 'Sunrise', sunrise], ['🌇', 'Sunset', sunset]].map(([icon, lbl, time]) => (
          <div key={lbl} className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{lbl}</p>
            <p className="text-[15px] font-bold text-white">{icon} {time ?? '—'}</p>
          </div>
        ))}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Daylight</p>
          <p className="text-[13px] font-bold text-white">{fmtDuration(daylightMs)}</p>
        </div>
      </div>
    </div>
  );
}
