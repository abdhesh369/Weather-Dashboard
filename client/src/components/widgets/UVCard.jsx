const UV_LABELS = ['Low', 'Low', 'Moderate', 'Moderate', 'High', 'High', 'Very High', 'Very High', 'Very High', 'Extreme', 'Extreme', 'Extreme+'];
const UV_COLORS = ['#22c55e','#22c55e','#eab308','#eab308','#f97316','#f97316','#ef4444','#ef4444','#ef4444','#7c3aed','#7c3aed','#7c3aed'];

export default function UVCard({ uv = 0 }) {
  const idx   = Math.min(Math.max(Math.round(uv), 0), 11);
  const label = UV_LABELS[idx];
  const color = UV_COLORS[idx];
  const pct   = Math.min((idx / 11) * 100, 95);

  return (
    <div
      className="p-5 rounded-[24px] flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.07em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
        UV index
      </p>

      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-bold text-white leading-none">{uv}</span>
        <span className="text-[14px] font-semibold" style={{ color }}>{label}</span>
      </div>

      {/* Colour-banded gauge */}
      <div className="relative h-2 rounded-full overflow-visible"
        style={{ background: 'linear-gradient(90deg,#22c55e 0%,#eab308 33%,#f97316 60%,#ef4444 80%,#7c3aed 100%)' }}>
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full border-[3px] transition-all duration-500"
          style={{
            left: `${pct}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            background: '#fff',
            borderColor: '#0a0f1e',
            boxShadow: '0 0 6px rgba(0,0,0,0.6)',
          }}
        />
      </div>

      <div className="flex justify-between">
        {['Low', 'Moderate', 'High', 'Max'].map(l => (
          <span key={l} className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
