export default function UnitToggle({ units, setUnits }) {
  return (
    <div
      className="flex p-[3px] gap-0.5 rounded-[10px]"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)' }}
    >
      {['metric', 'imperial'].map((u) => (
        <button
          key={u}
          onClick={() => setUnits(u)}
          className="px-3 py-1 rounded-[8px] text-[13px] font-semibold transition-all duration-200 border-none cursor-pointer"
          style={{
            background: units === u ? 'var(--brand-primary)' : 'transparent',
            color: units === u ? '#fff' : 'var(--text-muted)',
          }}
        >
          {u === 'metric' ? '°C' : '°F'}
        </button>
      ))}
    </div>
  );
}
