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
        top: `${Math.random() * 100}%`,
        delay: -Math.random() * 10, // Negative delay to start mid-animation
        duration: 0.8 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
      });
    }
    return arr;
  }, [intensity]); // Remove condition from dependency to avoid flicker on rerender if intensity is same

  if (c.includes('rain') || c.includes('drizzle')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-blue-300/40 w-[1px] weather-rain"
            style={{
              left: p.left,
              height: `${25 + Math.random() * 20}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity,
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
          <div
            key={p.id}
            className="absolute bg-white/60 rounded-full blur-[1px] weather-snow"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration * 3}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  if (c.includes('cloud') || c.includes('mist') || c.includes('fog')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute w-[180%] h-[40%] bg-white/5 blur-[80px] rounded-[100%]"
            style={{ 
              top: `${(i - 1) * 25}%`,
              left: '-40%',
              animation: `float ${15 + i * 5}s ease-in-out infinite`,
              animationDelay: `${-i * 2}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (c.includes('clear')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/10 blur-[100px] rounded-full weather-sun-ray"
        />
        <div 
          className="absolute top-10 right-10 w-40 h-40 bg-amber-400/5 blur-[60px] rounded-full weather-sun-ray"
          style={{ animationDelay: '-4s' }}
        />
      </div>
    );
  }

  return null;
}
