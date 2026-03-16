import { motion } from 'framer-motion';
import { getWeatherIcon } from '../utils/weather';
import { convertTemp } from '../utils/converters';

export default function HourlyForecast({ hourlyData = [], units }) {
  return (
    <div 
      className="p-6 rounded-[28px] flex flex-col gap-5 overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">
          Hourly Forecast
        </h3>
        <span className="text-[11px] font-medium text-white/20">Next 24 Hours</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {hourlyData.map((hour, idx) => {
          const Icon = getWeatherIcon(hour.condition);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-3 min-w-[70px] p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="text-[11px] font-bold text-white/40 group-hover:text-white transition-colors">
                {hour.time}
              </span>
              <Icon size={24} className="text-brand-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              <span className="text-sm font-bold text-white">
                {convertTemp(hour.temp, units)}°
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
