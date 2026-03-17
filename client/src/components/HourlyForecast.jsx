import { motion } from 'framer-motion';
import { convertTemp } from '../utils/converters';
import { getWeatherIcon } from '../lib/weatherIcons';

export default function HourlyForecast({ hourlyData = [], units }) {
  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '48px' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">
        Hourly Forecast
      </p>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {hourlyData.map((hour, i) => {
          const isNow = i === 0;
          return (
            <motion.div
              key={hour.time + i}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, translateY: -6 }}
              transition={{ delay: i * 0.04 + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 px-4 py-4 rounded-[16px] min-w-[72px] shrink-0 border border-transparent transition-colors hover:border-white/10 hover:bg-white/5"
              style={{
                background: isNow 
                  ? 'linear-gradient(180deg, rgba(99,102,241,0.2) 0%, transparent 100%)' 
                  : 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                borderColor: isNow ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isNow ? 'rgba(165,180,252,1)' : 'rgba(255,255,255,0.4)' }}>
                {isNow ? 'Now' : hour.time}
              </span>
              <div className="text-white drop-shadow-sm filter brightness-110">
                {getWeatherIcon(hour.condition, 24)}
              </div>
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
