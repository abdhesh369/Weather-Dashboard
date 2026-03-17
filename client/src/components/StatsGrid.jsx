import React from 'react';
import { motion } from 'framer-motion';
import { convertTemp, convertWind } from '../utils/converters';
import { StatIcons } from '../lib/weatherIcons';
import AnimatedCounter from './ui/AnimatedCounter';

function StatCard({ label, value, sub, percent, barGradient, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, translateY: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass glass-interactive rounded-[24px] group"
      style={{ padding: '32px' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10"
          style={{ background: barGradient ? `${barGradient.split(',')[1]?.trim()}22` : 'rgba(255,255,255,0.05)' }}>
          {StatIcons[label.replace(/\s+/g, '')] &&
            React.createElement(StatIcons[label.replace(/\s+/g, '')], { size: 16, className: 'text-white/90 drop-shadow-sm' })}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-40">{label}</p>
      </div>

      <p className="text-[26px] font-bold text-white leading-none mb-1 transition-transform duration-300 group-hover:translate-x-1"
        style={{ textShadow: 'var(--text-shadow-sm)' }}>
        {value}
      </p>
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
        </div>
      ) : children}
    </motion.div>
  );
}

function WindCompass({ deg = 0 }) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  const dir  = dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-25">
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50 8 L50 16 M50 84 L50 92 M8 50 L16 50 M84 50 L92 50"
            stroke="currentColor" strokeWidth="2" />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: 0 }}
          animate={{ rotate: deg }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <svg viewBox="0 0 100 100" className="w-5 h-8 text-brand-primary">
            <path d="M50 0 L62 38 L50 28 L38 38 Z" fill="currentColor" />
            <path d="M50 100 L38 62 L50 72 L62 62 Z" fill="currentColor" opacity="0.3" />
          </svg>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm z-10" />
        </div>
      </div>
      <span className="text-[13px] font-bold text-white/60">{dir}</span>
    </div>
  );
}

export default function StatsGrid({ weatherData, units }) {
  const { current } = weatherData;
  const hum      = current.humidity;
  const pressure = current.pressure ?? 1013;
  const vis      = current.visibility ?? 10;
  const clouds   = current.cloudiness ?? 0;

  // Feels-like delta badge
  const feelsRaw    = convertTemp(current.feelsLike, units);
  const tempRaw     = convertTemp(current.temperature, units);
  const feelsOffset = feelsRaw - tempRaw;
  const feelsSub    = Math.abs(feelsOffset) < 1
    ? 'Same as actual'
    : feelsOffset > 0
      ? `${Math.round(Math.abs(feelsOffset))}° warmer than actual`
      : `${Math.round(Math.abs(feelsOffset))}° cooler than actual`;

  const unitLabel = units === 'metric' ? '°C' : '°F';

  const stats = [
    {
      label:       'Humidity',
      value:       <><AnimatedCounter value={hum} />%</>,
      sub:         hum < 30 ? 'Very dry' : hum < 50 ? 'Comfortable' : hum < 70 ? 'Moderate' : 'High — muggy',
      percent:     hum,
      barGradient: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
      delay:       0,
    },
    {
      label:   'Wind',
      value:   <>{convertWind(current.windSpeed, units)}</>,
      sub:     current.windSpeed < 1 ? 'Calm' : current.windSpeed < 5 ? 'Light air' : current.windSpeed < 15 ? 'Moderate breeze' : 'Strong winds',
      children: <WindCompass deg={current.windDeg} />,
      delay:   0.07,
    },
    {
      label:       'Pressure',
      value:       <><AnimatedCounter value={pressure} /> hPa</>,
      sub:         pressure > 1022 ? 'High — clear skies likely' : pressure < 1000 ? 'Low — rain likely' : 'Normal',
      percent:     Math.round(Math.min(Math.max(((pressure - 980) / 60) * 100, 0), 100)),
      barGradient: 'linear-gradient(90deg,#f59e0b,#ef4444)',
      delay:       0.14,
    },
    {
      label:       'Visibility',
      value:       <><AnimatedCounter value={vis} /> km</>,
      sub:         vis >= 10 ? 'Excellent' : vis >= 5 ? 'Good' : vis >= 1 ? 'Moderate' : 'Poor',
      percent:     Math.min((vis / 10) * 100, 100),
      barGradient: 'linear-gradient(90deg,#8b5cf6,#ec4899)',
      delay:       0.21,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Feels like banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-[20px] flex items-center justify-between px-6 py-4"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
            <span style={{ fontSize: 16 }}>🌡</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Feels Like</p>
            <p className="text-[13px] font-medium text-white/60">{feelsSub}</p>
          </div>
        </div>
        <span className="text-[28px] font-bold text-white" style={{ textShadow: 'var(--text-shadow-sm)' }}>
          {feelsRaw}{unitLabel}
        </span>
      </motion.div>

      {/* Cloudiness banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-[20px] flex items-center justify-between px-6 py-3"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <span style={{ fontSize: 16 }}>☁️</span>
          </div>
          <p className="text-[12px] font-medium text-white/50">Cloud cover</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 rounded-full w-28 overflow-hidden bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#6366f1,#a78bfa)' }}
              initial={{ width: 0 }}
              animate={{ width: `${clouds}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <span className="text-[15px] font-bold text-white w-10 text-right">{clouds}%</span>
        </div>
      </motion.div>

      {/* Main 4-stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
    </div>
  );
}
