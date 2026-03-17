import { motion } from 'framer-motion';
import { convertWind, windLabel, degreesToCompass } from '../../utils/converters';

const COMPASS_DIRS = ['N','NE','E','SE','S','SW','W','NW'];

function WindRose({ deg = 0, speed = 0, gust = null }) {
  const isStrong = speed >= 10;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Outer ring */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
        {/* Cardinal tick marks */}
        {COMPASS_DIRS.map((dir, i) => {
          const angle  = (i * 45 - 90) * (Math.PI / 180);
          const isMajor = i % 2 === 0;
          const r1 = isMajor ? 48 : 50;
          const r2 = 54;
          const x1 = 60 + r1 * Math.cos(angle);
          const y1 = 60 + r1 * Math.sin(angle);
          const x2 = 60 + r2 * Math.cos(angle);
          const y2 = 60 + r2 * Math.sin(angle);
          const lx = 60 + 43 * Math.cos(angle);
          const ly = 60 + 43 * Math.sin(angle);
          return (
            <g key={dir}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isMajor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isMajor ? 1.5 : 1} />
              {isMajor && (
                <text x={lx} y={ly + 4}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8"
                  fontWeight="700"
                  fontFamily="sans-serif">
                  {dir}
                </text>
              )}
            </g>
          );
        })}

        {/* Speed ring(s) */}
        <circle cx="60" cy="60" r="35" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        <circle cx="60" cy="60" r="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        {/* Outer circle */}
        <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />

        {/* Wind direction arrow */}
        <motion.g
          style={{ transformOrigin: '60px 60px' }}
          animate={{ rotate: deg }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Arrow shaft */}
          <line x1="60" y1="60" x2="60" y2="28"
            stroke={isStrong ? '#f87171' : 'var(--brand-primary, #6366f1)'}
            strokeWidth="2.5" strokeLinecap="round" />
          {/* Arrowhead */}
          <polygon
            points="60,18 55,32 65,32"
            fill={isStrong ? '#f87171' : 'var(--brand-primary, #6366f1)'}
          />
          {/* Tail feather */}
          <line x1="60" y1="60" x2="60" y2="80"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Center dot */}
        <circle cx="60" cy="60" r="3.5" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

export default function WindCard({ speed = 0, deg = 0, gust = null, units = 'metric' }) {
  const dir      = degreesToCompass(deg);
  const label    = windLabel(speed);
  const isStrong = speed >= 10;

  // Beaufort-inspired color
  const speedColor = speed < 5 ? '#4ade80' : speed < 10 ? '#fbbf24' : speed < 20 ? '#fb923c' : '#f87171';

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '36px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Wind</p>
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{ background: `${speedColor}15`, color: speedColor, border: `1px solid ${speedColor}33` }}
        >
          {label}
        </span>
      </div>

      {/* Rose + stats side by side */}
      <div className="flex items-center gap-5">
        <WindRose deg={deg} speed={speed} gust={gust} />

        <div className="flex flex-col gap-4 flex-1">
          {/* Speed */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Speed</p>
            <p className="text-[22px] font-bold text-white leading-none">
              {convertWind(speed, units)}
            </p>
          </div>

          {/* Direction */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Direction</p>
            <p className="text-[18px] font-bold text-white leading-none">
              {dir}
              <span className="text-[13px] font-medium opacity-50 ml-1.5">{deg}°</span>
            </p>
          </div>

          {/* Gust */}
          {gust != null && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Gust</p>
              <p className="text-[16px] font-bold leading-none" style={{ color: gust > speed * 1.5 ? '#f97316' : 'rgba(255,255,255,0.8)' }}>
                {convertWind(gust, units)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Speed bar */}
      <div>
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <span>Calm</span><span>Breezy</span><span>Strong</span>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #4ade80, ${speedColor})` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((speed / 30) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          {/* Gust marker */}
          {gust != null && (
            <div
              className="absolute top-0 h-full w-0.5 rounded-full"
              style={{
                left: `${Math.min((gust / 30) * 100, 100)}%`,
                background: 'rgba(255,255,255,0.5)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
