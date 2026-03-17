export default function UnitToggle({ units, setUnits }) {
  return (
    <div
      role="group"
      aria-label="Temperature units"
      className="flex p-[3px] gap-0.5 rounded-[10px]"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {[
        { value: 'metric',   label: '°C', title: 'Celsius'    },
        { value: 'imperial', label: '°F', title: 'Fahrenheit' },
      ].map(({ value, label, title }) => {
        const active = units === value;
        return (
          <button
            key={value}
            onClick={() => setUnits(value)}
            title={title}
            aria-pressed={active}
            className="px-3 py-1.5 rounded-[8px] text-[13px] font-bold transition-all duration-200 border-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary outline-none"
            style={{
              background:  active ? 'var(--brand-primary)' : 'transparent',
              color:       active ? '#fff' : 'rgba(255,255,255,0.42)',
              boxShadow:   active ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
              transform:   active ? 'scale(1)' : 'scale(0.97)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
