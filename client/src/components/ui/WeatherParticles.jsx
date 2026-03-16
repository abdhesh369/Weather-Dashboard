import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * WeatherParticles
 * Renders subtle environmental effects like rain, snow, or mist.
 * @param {string} condition - The current weather condition (rain, snow, clouds, etc.)
 * @param {number} intensity - Number of particles to render
 */
export default function WeatherParticles({ condition = 'clear', intensity = 20 }) {
  const c = condition.toLowerCase();
  
  const particles = useMemo(() => {
    const arr = [];
    const count = intensity;
    
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 1.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
        size: 1 + Math.random() * 3,
      });
    }
    return arr;
  }, [intensity, condition]);

  if (c.includes('rain') || c.includes('drizzle')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: '110vh', opacity: p.opacity }}
            transition={{
              duration: p.duration * 0.5,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            className="absolute bg-blue-300/40 w-[1px]"
            style={{
              left: p.left,
              height: `${20 + Math.random() * 30}px`,
              transform: 'rotate(15deg)',
            }}
          />
        ))}
      </div>
    );
  }

  if (c.includes('snow')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -20, opacity: 0, x: 0 }}
            animate={{ 
              y: '110vh', 
              opacity: p.opacity,
              x: [0, 20, -20, 0]
            }}
            transition={{
              y: { duration: p.duration * 2, repeat: Infinity, delay: p.delay, ease: "linear" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1 }
            }}
            className="absolute bg-white/60 rounded-full blur-[1px]"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (c.includes('cloud') || c.includes('mist') || c.includes('fog')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: 0.05 }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              delay: i * 5,
              ease: "linear"
            }}
            className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[60px]"
            style={{ top: `${(i - 1) * 30}%` }}
          />
        ))}
      </div>
    );
  }

  return null;
}
