import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';

function getEmoji(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear'))   return '☀️';
  if (c.includes('drizzle')) return '🌦️';
  if (c.includes('rain'))    return '🌧️';
  if (c.includes('snow'))    return '❄️';
  if (c.includes('thunder')) return '⛈️';
  if (c.includes('cloud'))   return '☁️';
  return '🌤️';
}

export default function DailyForecast({ dailyData = [], units }) {
  const allLo = dailyData.map(d => convertTemp(d.tempLow,  units));
  const allHi = dailyData.map(d => convertTemp(d.tempHigh, units));
  const minT  = Math.min(...allLo);
  const maxT  = Math.max(...allHi);
  const range = Math.max(maxT - minT, 1);

  return (
    <div className="glass p-8 rounded-[32px] flex flex-col gap-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-40">
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
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 py-[11px]"
              style={{ borderBottom: i < dailyData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              {/* Day */}
              <span className="text-[14px] font-semibold text-white w-[60px] shrink-0">
                {i === 0 ? 'Today' : day.day}
              </span>

              {/* Emoji */}
              <span style={{ fontSize: 18, flexShrink: 0 }}>{getEmoji(day.condition)}</span>

              {/* Condition */}
              <span className="text-[12px] flex-1 truncate capitalize" style={{ color: 'rgba(255,255,255,0.42)' }}>
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
  );
}
