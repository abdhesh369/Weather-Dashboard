import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pure CSS gradient backgrounds — no external image dependencies,
// faster LCP and works fully offline.
const GRADIENTS = {
  clear:        ['#0ea5e9','#1d4ed8','#1e40af'],
  clouds:       ['#475569','#334155','#1e293b'],
  rain:         ['#1e3a5f','#1e293b','#0f172a'],
  drizzle:      ['#1e3a5f','#1e293b','#0f172a'],
  snow:         ['#94a3b8','#e2e8f0','#cbd5e1'],
  thunderstorm: ['#1e1b4b','#312e81','#0f0a1e'],
  mist:         ['#4b5563','#374151','#1f2937'],
  fog:          ['#4b5563','#374151','#1f2937'],
  haze:         ['#6b7280','#4b5563','#374151'],
  default:      ['#1e1b4b','#312e81','#0f172a'],
};

// Decorative animated orbs for each condition
const ORBS = {
  clear:        [{ x: '10%',  y: '10%',  color: '#38bdf8', size: 600 }, { x: '80%', y: '60%', color: '#1d4ed8', size: 400 }],
  clouds:       [{ x: '20%',  y: '20%',  color: '#475569', size: 500 }, { x: '70%', y: '50%', color: '#334155', size: 350 }],
  rain:         [{ x: '15%',  y: '15%',  color: '#1e3a8a', size: 500 }, { x: '75%', y: '70%', color: '#0369a1', size: 400 }],
  snow:         [{ x: '25%',  y: '25%',  color: '#bae6fd', size: 500 }, { x: '65%', y: '55%', color: '#e2e8f0', size: 350 }],
  thunderstorm: [{ x: '30%',  y: '20%',  color: '#4f46e5', size: 600 }, { x: '60%', y: '60%', color: '#7c3aed', size: 400 }],
  default:      [{ x: '20%',  y: '15%',  color: '#4f46e5', size: 550 }, { x: '70%', y: '65%', color: '#7c3aed', size: 350 }],
};

function getConditionKey(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear'))   return 'clear';
  if (c.includes('cloud'))   return 'clouds';
  if (c.includes('drizzle')) return 'drizzle';
  if (c.includes('rain'))    return 'rain';
  if (c.includes('snow'))    return 'snow';
  if (c.includes('thunder')) return 'thunderstorm';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'fog';
  return 'default';
}

export default function WeatherBackground({ condition }) {
  const key    = getConditionKey(condition);
  const colors = GRADIENTS[key] ?? GRADIENTS.default;
  const orbs   = ORBS[key]     ?? ORBS.default;

  const gradient = `radial-gradient(ellipse at 20% 20%, ${colors[0]}55 0%, transparent 60%),
    radial-gradient(ellipse at 80% 80%, ${colors[1]}44 0%, transparent 60%),
    linear-gradient(160deg, ${colors[2]}cc 0%, #030712 100%)`;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ background: gradient }}
        >
          {/* Decorative blurred orbs */}
          {orbs.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: orb.x,
                top:  orb.y,
                width:  orb.size,
                height: orb.size,
                background: orb.color,
                opacity: 0.12,
                filter: 'blur(120px)',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.10, 0.16, 0.10],
              }}
              transition={{
                duration: 8 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 2,
              }}
            />
          ))}

          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
