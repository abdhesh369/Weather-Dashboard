import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUNDS = {
  clear: 'https://images.unsplash.com/photo-1601297183314-c09d33f5e0cf?q=80&w=1920&auto=format&fit=crop',
  clouds: 'https://images.unsplash.com/photo-1590867286251-8e26d9f255c0?q=80&w=1920&auto=format&fit=crop',
  rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920&auto=format&fit=crop',
  drizzle: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920&auto=format&fit=crop',
  snow: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=1920&auto=format&fit=crop',
  thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=1920&auto=format&fit=crop',
  mist: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1920&auto=format&fit=crop',
  fog: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1920&auto=format&fit=crop',
  haze: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1920&auto=format&fit=crop',
};

export default function WeatherBackground({ condition = 'clear' }) {
  const c = condition.toLowerCase();
  let bg = BACKGROUNDS.clear;
  
  if (c.includes('cloud')) bg = BACKGROUNDS.clouds;
  else if (c.includes('rain')) bg = BACKGROUNDS.rain;
  else if (c.includes('drizzle')) bg = BACKGROUNDS.drizzle;
  else if (c.includes('snow')) bg = BACKGROUNDS.snow;
  else if (c.includes('thunder')) bg = BACKGROUNDS.thunderstorm;
  else if (c.includes('mist') || c.includes('fog') || c.includes('haze')) bg = BACKGROUNDS.mist;
  else if (c.includes('clear')) bg = BACKGROUNDS.clear;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={bg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
        >
          {/* Overlays for legibility */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
