export default function SunCard({ sunrise = '6:12', sunset = '20:34' }) {
  function parseTime(str) {
    const [h, m] = (str || '').split(':').map(Number);
    const d = new Date(); d.setHours(h || 6, m || 0, 0, 0);
    return d;
  }

  const now   = new Date();
  const rise  = parseTime(sunrise);
  const set   = parseTime(sunset);
  const total = set - rise;
  const elapsed = Math.max(0, Math.min(now - rise, total));
  const pct   = total > 0 ? elapsed / total : 0;

  // SVG arc: semicircle from left to right
  const R = 36; const cx = 50; const cy = 46;
  const angle = Math.PI - pct * Math.PI;
  const sunX = (cx + R * Math.cos(angle)).toFixed(1);
  const sunY = (cy - R * Math.sin(angle)).toFixed(1);

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '48px' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">
        Sun
      </p>

      <svg viewBox="0 0 100 52" fill="none" className="w-full" style={{ height: 64 }}>
        {/* Track */}
        <path d="M 12 46 A 38 38 0 0 1 88 46" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 4" />
        {/* Progress */}
        <path
          d={`M 12 46 A 38 38 0 0 1 ${sunX} ${sunY}`}
          stroke="url(#sunGrad)" strokeWidth="3" strokeLinecap="round"
        />
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        {/* Sun glow */}
        <circle cx={sunX} cy={sunY} r="10"  fill="rgba(251,191,36,0.3)" className="animate-[ping_3s_ease-in-out_infinite]" />
        <circle cx={sunX} cy={sunY} r="6"  fill="#fbbf24" opacity="1" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }} className="animate-pulse" />
      </svg>

      <div className="flex justify-between">
        {[['Sunrise', '🌅', sunrise], ['Sunset', '🌇', sunset]].map(([lbl, icon, time]) => (
          <div key={lbl} className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {lbl}
            </p>
            <p className="text-[15px] font-bold text-white">{icon} {time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
