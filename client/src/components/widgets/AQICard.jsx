import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';

const AQI_LEVELS = [
  { label: 'Good',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  advice: 'Air quality is satisfactory. Perfect for outdoor activities.' },
  { label: 'Fair',      color: '#84cc16', bg: 'rgba(132,204,22,0.12)', advice: 'Acceptable air quality. Sensitive individuals may be slightly affected.' },
  { label: 'Moderate',  color: '#eab308', bg: 'rgba(234,179,8,0.12)',  advice: 'Sensitive groups may experience health effects. Limit prolonged outdoor exertion.' },
  { label: 'Poor',      color: '#f97316', bg: 'rgba(249,115,22,0.12)', advice: 'Health effects possible for all. Reduce prolonged outdoor activities.' },
  { label: 'Very Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  advice: 'Health alert: everyone may experience serious effects. Stay indoors.' },
];

// WHO guideline limits for context
const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', max: 75,  who: 15,  color: '#f59e0b' },
  { key: 'pm10',  label: 'PM10',  unit: 'μg/m³', max: 150, who: 45,  color: '#f97316' },
  { key: 'o3',    label: 'O₃',    unit: 'μg/m³', max: 200, who: 100, color: '#60a5fa' },
  { key: 'no2',   label: 'NO₂',   unit: 'μg/m³', max: 200, who: 40,  color: '#a78bfa' },
  { key: 'so2',   label: 'SO₂',   unit: 'μg/m³', max: 350, who: 40,  color: '#34d399' },
  { key: 'co',    label: 'CO',    unit: 'μg/m³', max: 10000, who: 4000, color: '#fb7185' },
];

function PollutantBar({ label, value, unit, max, who, color }) {
  const pct    = Math.min((value / max) * 100, 100);
  const whoPct = Math.min((who  / max) * 100, 100);
  const overWHO = value > who;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-white/40">{label}</span>
        <span className="text-[12px] font-bold" style={{ color: overWHO ? '#f97316' : 'rgba(255,255,255,0.7)' }}>
          {Math.round(value)}
          <span className="text-[9px] font-medium opacity-50 ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-visible" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: color, opacity: 0.85 }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* WHO guideline marker */}
        <div
          className="absolute top-[-3px] w-[2px] h-[9px] rounded-sm"
          style={{ left: `${whoPct}%`, background: 'rgba(255,255,255,0.35)' }}
          title={`WHO limit: ${who} ${unit}`}
        />
      </div>
    </div>
  );
}

export default function AQICard({ aqiData }) {
  if (!aqiData) return null;

  const index   = Math.max(1, Math.min(aqiData.main.aqi, 5)) - 1;
  const { label, color, bg, advice } = AQI_LEVELS[index];
  const components = aqiData.components;

  return (
    <TiltCard>
      <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '36px' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Air Quality</p>
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
            style={{ color, borderColor: `${color}44`, background: bg, boxShadow: `0 0 12px ${color}22` }}
          >
            {label}
          </motion.span>
        </div>

        {/* Index + advice */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[40px] font-bold leading-none"
              style={{ color }}
            >
              {aqiData.main.aqi}
              <span className="text-[16px] font-medium opacity-50 ml-1">/5</span>
            </motion.p>
            <p className="text-[12px] text-white/45 font-medium mt-1 max-w-[180px] leading-snug">{advice}</p>
          </div>

          {/* Segmented gauge */}
          <div className="flex items-end gap-1 ml-auto self-center">
            {AQI_LEVELS.map((lvl, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-sm origin-bottom"
                style={{
                  width: 8,
                  height: 8 + i * 6,
                  background: i <= index ? lvl.color : 'rgba(255,255,255,0.08)',
                  boxShadow: i === index ? `0 0 8px ${lvl.color}88` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Pollutant bars */}
        <div className="flex flex-col gap-3 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-30">Pollutants (white bar = WHO limit)</p>
          {POLLUTANTS.filter(p => components[p.key] !== undefined).map(p => (
            <PollutantBar key={p.key} value={components[p.key]} {...p} />
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
