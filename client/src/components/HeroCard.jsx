import { motion } from 'framer-motion';
import { MapPin, Star, Thermometer, Wind, Droplets, ArrowUp, ArrowDown, Compass } from 'lucide-react';
import { getWeatherIcon, formatWeatherDate } from '../utils/weather';
import { convertTemp, convertWind } from '../utils/converters';

export default function HeroCard({ 
  weatherData, 
  units, 
  onAddFavorite, 
  isFavorite 
}) {
  if (!weatherData?.current) return null;
  
  const { current, forecast } = weatherData;
  const unitLabel = units === 'metric' ? '°C' : '°F';
  
  let Icon = Cloud;
  try {
    Icon = getWeatherIcon(current.condition) || Cloud;
  } catch (e) {
    console.warn('Icon mapping failed', e);
  }

  const now = new Date();

  const tempHigh = forecast?.daily?.[0]?.tempHigh;
  const tempLow = forecast?.daily?.[0]?.tempLow;

  return (
    <div 
      className="relative overflow-hidden p-8 rounded-[32px] text-white transition-all duration-500 shadow-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* City & Date */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 translate-x-[-2px]">
            <MapPin size={16} className="text-brand-primary" />
            <span className="text-xl font-bold tracking-tight">{current.city}, {current.country}</span>
          </div>
          <p className="text-sm font-medium text-white/40">
            {formatWeatherDate(now, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddFavorite(current.city)}
          disabled={isFavorite}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFavorite 
              ? 'bg-amber-500 text-white border-none cursor-default' 
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Main Temp & Icon */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex flex-col items-center md:items-start">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl font-bold tracking-tighter mb-2"
          >
            {convertTemp(current.temperature, units)}
            <span className="text-4xl md:text-5xl font-medium text-white/30 align-top ml-1">°</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold opacity-90">{current.description}</span>
            {tempHigh && tempLow && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/60">
                <span className="flex items-center gap-1"><ArrowUp size={12} className="text-red-400" />{convertTemp(tempHigh, units)}°</span>
                <span className="flex items-center gap-1"><ArrowDown size={12} className="text-blue-400" />{convertTemp(tempLow, units)}°</span>
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-brand-primary/20 blur-[60px] rounded-full scale-150" />
          <Icon size={140} strokeWidth={1.5} className="relative drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* Meta chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Thermometer size={16} />, label: 'Feels Like', value: `${convertTemp(current.feelsLike, units)}°` },
          { icon: <Droplets size={16} />, label: 'Humidity', value: `${current.humidity}%` },
          { icon: <Wind size={16} />, label: 'Wind Speed', value: convertWind(current.windSpeed, units) },
          { icon: <Compass size={16} />, label: 'Pressure', value: '1012 hPa' }, // Example fallback
        ].map((chip, idx) => (
          <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-white/30 font-medium text-[11px] uppercase tracking-wider">
              {chip.icon}
              {chip.label}
            </div>
            <span className="text-base font-bold whitespace-nowrap">{chip.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
