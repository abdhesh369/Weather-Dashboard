import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';

const EMOJIS = {
  clear: '☀️', clouds: '☁️', rain: '🌧️',
  drizzle: '🌦️', snow: '❄️', thunderstorm: '⛈️',
};

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

export default function HourlyForecast({ hourlyData = [], units }) {
  return (
    <div className="glass p-8 rounded-[32px] flex flex-col gap-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-40">
        Hourly Forecast
      </p>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {hourlyData.map((hour, i) => {
          const isNow = i === 0;
          return (
            <motion.div
              key={hour.time + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex flex-col items-center gap-2 px-3.5 py-3 rounded-[12px] min-w-[66px] shrink-0"
              style={{
                background: isNow ? 'rgba(99,102,241,0.18)' : 'transparent',
                border: `1px solid ${isNow ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
              }}
            >
              <span className="text-[11px] font-semibold" style={{ color: isNow ? 'rgba(165,180,252,0.9)' : 'rgba(255,255,255,0.4)' }}>
                {isNow ? 'Now' : hour.time}
              </span>
              <span style={{ fontSize: 22 }}>{getEmoji(hour.condition)}</span>
              <span className="text-[15px] font-bold text-white">
                {convertTemp(hour.temp, units)}°
              </span>
              {(hour.pop ?? 0) > 0 ? (
                <span className="text-[10px] font-semibold" style={{ color: 'rgba(96,165,250,0.85)' }}>
                  {hour.pop}%
                </span>
              ) : (
                <span style={{ height: 14 }} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
