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
    <div
      className="p-5 rounded-[24px] flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.07em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
        Sun
      </p>

      <svg viewBox="0 0 100 52" fill="none" className="w-full" style={{ height: 52 }}>
        {/* Track */}
        <path d="M 14 46 A 36 36 0 0 1 86 46" stroke="rgba(255,255,255,0.10)" strokeWidth="2" strokeLinecap="round" />
        {/* Progress */}
        <path
          d={`M 14 46 A 36 36 0 0 1 ${sunX} ${sunY}`}
          stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
        />
        {/* Sun glow */}
        <circle cx={sunX} cy={sunY} r="9"  fill="rgba(251,191,36,0.15)" />
        <circle cx={sunX} cy={sunY} r="5"  fill="#fbbf24" opacity="0.95" />
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
