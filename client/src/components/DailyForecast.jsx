import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';
import TiltCard from './ui/TiltCard';
import { getWeatherIcon } from '../lib/weatherIcons';

export default function DailyForecast({ dailyData = [], units }) {
  const allLo = dailyData.map(d => convertTemp(d.tempLow,  units));
  const allHi = dailyData.map(d => convertTemp(d.tempHigh, units));
  const minT  = Math.min(...allLo);
  const maxT  = Math.max(...allHi);
  const range = Math.max(maxT - minT, 1);

  return (
    <TiltCard>
      <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '48px' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">
        7-day forecast
      </p>

      <div className="flex flex-col">
        {dailyData.map((day, i) => {
          const lo = convertTemp(day.tempLow,  units);
          const hi = convertTemp(day.tempHigh, units);
          const barLeft  = Math.round(((lo - minT) / range) * 100);
          const barWidth = Math.max(Math.round(((hi - lo)  / range) * 100), 8);

          return (
            <motion.div
              key={day.day + i}
              initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.08)' }}
              transition={{ delay: i * 0.05 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 py-[14px] px-2 rounded-xl transition-colors hover:bg-white/5 group/row"
              style={{ borderBottom: i < dailyData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Day */}
              <span className="text-[15px] font-bold text-white w-[64px] shrink-0">
                {i === 0 ? 'Today' : day.day}
              </span>
              
              {/* Icon */}
              <div className="text-white drop-shadow-sm group-hover/row:scale-110 transition-transform shrink-0">
                {getWeatherIcon(day.condition, 20)}
              </div>

              {/* Condition */}
              <span className="text-[13px] font-medium flex-1 truncate capitalize opacity-40 group-hover/row:opacity-100 transition-opacity">
                {day.condition}
              </span>

              {/* Lo · bar · Hi */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px] font-medium w-8 text-right" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {lo}°
                </span>
                <div className="relative h-[4px] rounded-full w-[54px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div
                    className="absolute top-0 h-full rounded-full"
                    style={{ left: `${barLeft}%`, background: 'linear-gradient(90deg,#60a5fa,#f59e0b)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.06 }}
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
