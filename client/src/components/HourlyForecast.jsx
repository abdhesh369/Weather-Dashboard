import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';
import { getWeatherIcon } from '../lib/weatherIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HourlyForecast({ hourlyData = [], units }) {
  const scrollRef = useRef(null);
  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 20);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
  };

  // Group by day label for separators
  const slots = hourlyData.slice(0, 24).map((hour, i) => {
    const date  = hour.dt ? new Date(hour.dt * 1000) : null;
    const isNew = date && i > 0 && (() => {
      const prev = hourlyData[i - 1];
      const prevDate = prev.dt ? new Date(prev.dt * 1000) : null;
      return prevDate && date.getDate() !== prevDate.getDate();
    })();
    return { ...hour, isNow: i === 0, isNewDay: isNew, date };
  });

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '40px' }}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Hourly Forecast</p>
        <div className="flex items-center gap-1.5">
          <motion.button
            onClick={() => scroll(-1)}
            disabled={!showLeft}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-150"
            style={{ background: showLeft ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', color: showLeft ? '#fff' : 'rgba(255,255,255,0.2)' }}
          >
            <ChevronLeft size={14} />
          </motion.button>
          <motion.button
            onClick={() => scroll(1)}
            disabled={!showRight}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-150"
            style={{ background: showRight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', color: showRight ? '#fff' : 'rgba(255,255,255,0.2)' }}
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2"
      >
        {slots.map((hour, i) => (
          <div key={hour.time + i} className="flex items-stretch gap-0 shrink-0">
            {/* Day separator */}
            {hour.isNewDay && (
              <div className="flex flex-col items-center justify-center mx-2 shrink-0">
                <div className="h-full w-px bg-white/10" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 rotate-90 whitespace-nowrap my-1">
                  {hour.date?.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <div className="h-full w-px bg-white/10" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.06, translateY: -5 }}
              transition={{ delay: i * 0.025 + 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2.5 px-3.5 py-4 rounded-[18px] min-w-[72px] transition-colors"
              style={{
                background: hour.isNow
                  ? 'linear-gradient(180deg, rgba(99,102,241,0.22) 0%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
                border: `1px solid ${hour.isNow ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: hour.isNow ? 'rgba(165,180,252,1)' : 'rgba(255,255,255,0.38)' }}>
                {hour.isNow ? 'Now' : hour.time}
              </span>

              <div className="text-white drop-shadow-sm">
                {getWeatherIcon(hour.condition, 22)}
              </div>

              <span className="text-[15px] font-bold text-white">
                {convertTemp(hour.temp, units)}°
              </span>

              {/* Precipitation chance */}
              {(hour.pop ?? 0) > 0 ? (
                <span className="text-[10px] font-bold" style={{ color: 'rgba(96,165,250,0.9)' }}>
                  💧{hour.pop}%
                </span>
              ) : (
                <span style={{ height: 14 }} />
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 rounded-l-[32px]"
        style={{ background: showLeft ? 'linear-gradient(90deg,rgba(0,0,0,0.25),transparent)' : 'none' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 rounded-r-[32px]"
        style={{ background: showRight ? 'linear-gradient(270deg,rgba(0,0,0,0.25),transparent)' : 'none' }} />
    </div>
  );
}
