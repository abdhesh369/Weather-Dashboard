import { motion } from 'framer-motion';
import { getWeatherIcon } from '../utils/weather';
import { convertTemp } from '../utils/converters';

export default function DailyForecast({ dailyData = [], units }) {
  return (
    <div 
      className="p-6 rounded-[28px] flex flex-col gap-6"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-1">
        5-Day Forecast
      </h3>

      <div className="flex flex-col gap-2">
        {dailyData.map((day, idx) => {
          const Icon = getWeatherIcon(day.condition);
          return (
            <div 
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4 w-24">
                <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">
                  {idx === 0 ? 'Today' : day.day}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-center">
                <Icon size={18} className="text-brand-primary/80" />
                <span className="text-[13px] font-medium text-white/40 group-hover:text-white/60 transition-colors capitalize">
                  {day.condition}
                </span>
              </div>

              <div className="flex items-center gap-3 w-24 justify-end font-bold">
                <span className="text-sm text-white">{convertTemp(day.tempHigh, units)}°</span>
                <span className="text-sm text-white/30">{convertTemp(day.tempLow, units)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
