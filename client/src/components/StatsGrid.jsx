import { motion } from 'framer-motion';
import { convertWind } from '../utils/converters';

function StatCard({ label, value, sub, percent, barGradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="p-4 rounded-[14px]"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
        {label}
      </p>
      <p className="text-[22px] font-bold text-white leading-none mb-0.5">{value}</p>
      <p className="text-[11px] mb-2.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{sub}</p>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: barGradient }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          transition={{ duration: 0.7, delay: delay + 0.15, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function StatsGrid({ weatherData, units }) {
  const { current } = weatherData;
  const wind = current.windSpeed;
  const hum  = current.humidity;
  const pressure = current.pressure ?? 1013;
  const vis  = current.visibility ?? 10;

  const stats = [
    {
      label: 'Humidity',
      value: `${hum}%`,
      sub: hum < 40 ? 'Low — dry air' : hum < 70 ? 'Comfortable' : 'High — muggy',
      percent: hum,
      barGradient: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
      delay: 0,
    },
    {
      label: 'Wind',
      value: convertWind(wind, units),
      sub: wind < 5 ? 'Calm' : wind < 15 ? 'Light breeze' : wind < 30 ? 'Moderate' : 'Strong winds',
      percent: Math.min((wind / 30) * 100, 100),
      barGradient: 'linear-gradient(90deg,#10b981,#6366f1)',
      delay: 0.06,
    },
    {
      label: 'Pressure',
      value: `${pressure} hPa`,
      sub: pressure > 1013 ? 'High pressure' : pressure < 1000 ? 'Low pressure' : 'Normal',
      percent: Math.round(Math.min(Math.max(((pressure - 980) / 60) * 100, 0), 100)),
      barGradient: 'linear-gradient(90deg,#f59e0b,#ef4444)',
      delay: 0.12,
    },
    {
      label: 'Visibility',
      value: `${vis} km`,
      sub: vis >= 10 ? 'Excellent' : vis >= 5 ? 'Good' : 'Poor',
      percent: Math.min((vis / 10) * 100, 100),
      barGradient: 'linear-gradient(90deg,#8b5cf6,#ec4899)',
      delay: 0.18,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {stats.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  );
}
