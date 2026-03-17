import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';
import TiltCard from './ui/TiltCard';
import { getWeatherIcon } from '../lib/weatherIcons';
import { Droplets } from 'lucide-react';

export default function DailyForecast({ dailyData = [], units }) {
  const allLo = dailyData.map(d => convertTemp(d.tempLow,  units));
  const allHi = dailyData.map(d => convertTemp(d.tempHigh, units));
  const minT  = Math.min(...allLo);
  const maxT  = Math.max(...allHi);
  const range = Math.max(maxT - minT, 1);

  return (
    <TiltCard>
      <div className="glass glass-interactive rounded-[32px] flex flex-col gap-5" style={{ padding: '40px' }}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">7-Day Forecast</p>
          <span className="text-[10px] text-white/25 font-medium">Hi / Lo</span>
        </div>

        <div className="flex flex-col">
          {dailyData.map((day, i) => {
            const lo = convertTemp(day.tempLow,  units);
            const hi = convertTemp(day.tempHigh, units);
            const barLeft  = Math.round(((lo - minT) / range) * 100);
            const barWidth = Math.max(Math.round(((hi - lo) / range) * 100), 8);

            return (
              <motion.div
                key={day.day + i}
                initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0,   filter: 'blur(0px)' }}
                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.06)' }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 py-[13px] px-2 rounded-xl transition-colors group/row"
                style={{ borderBottom: i < dailyData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                {/* Day */}
                <span className="text-[14px] font-bold text-white w-[58px] shrink-0">
                  {i === 0 ? 'Today' : day.day}
                </span>

                {/* Icon */}
                <div className="text-white drop-shadow-sm group-hover/row:scale-110 transition-transform shrink-0">
                  {getWeatherIcon(day.condition, 18)}
                </div>

                {/* Precip chance */}
                <div className="w-10 shrink-0 flex items-center justify-end">
                  {(day.pop ?? 0) > 10 && (
                    <span className="flex items-center gap-0.5 text-[11px] font-bold" style={{ color: 'rgba(96,165,250,0.8)' }}>
                      <Droplets size={10} />
                      {day.pop}%
                    </span>
                  )}
                </div>

                {/* Lo · bar · Hi */}
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <span className="text-[13px] font-medium w-8 text-right" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {lo}°
                  </span>
                  <div className="relative h-[4px] rounded-full w-[52px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div
                      className="absolute top-0 h-full rounded-full"
                      style={{ left: `${barLeft}%`, background: 'linear-gradient(90deg,#60a5fa,#f59e0b)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.06 }}
                    />
                  </div>
                  <span className="text-[14px] font-bold text-white w-8 text-right">{hi}°</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </TiltCard>
  );
}
