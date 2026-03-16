import { motion } from 'framer-motion';
import { convertWind } from '../utils/converters';

function StatCard({ label, value, sub, percent, barGradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass p-8 rounded-[24px] group"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-4 opacity-40">
        {label}
      </p>
      <p className="text-[26px] font-bold text-white leading-none mb-1 transition-transform duration-300 group-hover:translate-x-1">{value}</p>
      <p className="text-[12px] mb-4 opacity-50 font-medium">{sub}</p>
      
      {percent !== undefined ? (
        <div className="h-1.5 rounded-full overflow-hidden bg-white/5 relative">
          <motion.div
            className="h-full rounded-full"
            style={{ background: barGradient }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div 
            className="absolute top-0 right-0 h-full w-4 blur-sm opacity-50"
            style={{ background: 'white' }}
          />
        </div>
      ) : children}
    </motion.div>
  );
}

function WindCompass({ deg = 0 }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center mx-auto mt-1">
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="currentColor" strokeWidth="2" />
      </svg>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: deg }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-6 h-10 text-brand-primary">
          <path d="M50 0 L65 40 L50 30 L35 40 Z" fill="currentColor" />
          <path d="M50 100 L35 60 L50 70 L65 60 Z" fill="currentColor" opacity="0.3" />
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm z-10" />
      </div>
    </div>
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
      children: <WindCompass deg={current.windDeg} />,
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
