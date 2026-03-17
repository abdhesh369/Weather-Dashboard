import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';

const AQI_LEVELS = [
  { label: 'Good', color: '#22c55e', desc: 'Air quality is satisfactory.' },
  { label: 'Fair', color: '#84cc16', desc: 'Air quality is acceptable.' },
  { label: 'Moderate', color: '#eab308', desc: 'May be a risk for some.' },
  { label: 'Poor', color: '#f97316', desc: 'Health effects can occur.' },
  { label: 'Very Poor', color: '#ef4444', desc: 'Health warnings for all.' },
];

export default function AQICard({ aqiData }) {
  if (!aqiData) return null;
  
  const index = Math.max(1, Math.min(aqiData.main.aqi, 5)) - 1;
  const { label, color, desc } = AQI_LEVELS[index];
  const components = aqiData.components;

  return (
    <TiltCard>
      <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '48px' }}>
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">
            Air Quality
          </p>
          <span 
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 shadow-lg"
            style={{ 
              color, 
              borderColor: `${color}44`, 
              background: `${color}15`,
              boxShadow: `0 0 12px ${color}22`
            }}
          >
            {label}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[28px] font-bold text-white leading-none">
            Level {aqiData.main.aqi}
          </p>
          <p className="text-[13px] text-white/40 font-medium">{desc}</p>
        </div>

        {/* Gauge bar */}
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${AQI_LEVELS[0].color}, ${color})`,
              boxShadow: `0 0 8px ${color}44`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(aqiData.main.aqi / 5) * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
            <AQIStat label="PM2.5" value={components.pm2_5} unit="μg/m³" />
            <AQIStat label="PM10" value={components.pm10} unit="μg/m³" />
            <AQIStat label="O₃" value={components.o3} unit="μg/m³" />
            <AQIStat label="NO₂" value={components.no2} unit="μg/m³" />
        </div>
      </div>
    </TiltCard>
  );
}

function AQIStat({ label, value, unit }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-white/30 uppercase">{label}</span>
      <p className="text-[14px] font-bold text-white/80">{Math.round(value)} <span className="text-[10px] opacity-40">{unit}</span></p>
    </div>
  );
}
