import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  CloudDrizzle,
  CloudFog,
  Waves
} from 'lucide-react';

export const getWeatherIcon = (condition, size = 24, className = "") => {
  if (!condition) return <Sun size={size} className={className} />;
  
  const c = condition.toLowerCase();
  
  if (c.includes('clear')) return <Sun size={size} className={className} />;
  if (c.includes('thunderstorm')) return <CloudLightning size={size} className={className} />;
  if (c.includes('drizzle')) return <CloudDrizzle size={size} className={className} />;
  if (c.includes('rain')) return <CloudRain size={size} className={className} />;
  if (c.includes('snow')) return <CloudSnow size={size} className={className} />;
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return <CloudFog size={size} className={className} />;
  
  if (c.includes('cloud')) {
    if (c.includes('few') || c.includes('scattered') || c.includes('broken')) {
      return <CloudSun size={size} className={className} />;
    }
    return <Cloud size={size} className={className} />;
  }
  
  return <Cloud size={size} className={className} />;
};

export const StatIcons = {
  Humidity: Droplets,
  Wind: Wind,
  Pressure: Thermometer,
  Visibility: Eye,
  FeelsLike: Waves
};
