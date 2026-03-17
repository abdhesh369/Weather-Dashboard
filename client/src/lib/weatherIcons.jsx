import React from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
  CloudSun, CloudDrizzle, CloudFog, Wind, Droplets,
  Thermometer, Eye, Waves, Gauge,
} from 'lucide-react';

// Color map for each condition category
const ICON_COLORS = {
  clear:        '#fbbf24',
  clouds:       '#94a3b8',
  partlyCloudy: '#7dd3fc',
  drizzle:      '#60a5fa',
  rain:         '#3b82f6',
  snow:         '#e2e8f0',
  thunderstorm: '#a78bfa',
  fog:          '#9ca3af',
  wind:         '#6ee7b7',
  default:      '#94a3b8',
};

/**
 * Returns a colored JSX icon for a given OWM condition string.
 * @param {string} condition - e.g. "Clear", "Rain", "Clouds"
 * @param {number} size      - icon size in px
 * @param {string} className - extra CSS classes
 */
export const getWeatherIcon = (condition, size = 24, className = '') => {
  if (!condition) return <Cloud size={size} className={className} style={{ color: ICON_COLORS.default }} />;
  const c = condition.toLowerCase();

  if (c.includes('clear')) {
    return <Sun size={size} className={className} style={{ color: ICON_COLORS.clear }} />;
  }
  if (c.includes('thunderstorm')) {
    return <CloudLightning size={size} className={className} style={{ color: ICON_COLORS.thunderstorm }} />;
  }
  if (c.includes('drizzle')) {
    return <CloudDrizzle size={size} className={className} style={{ color: ICON_COLORS.drizzle }} />;
  }
  if (c.includes('rain')) {
    return <CloudRain size={size} className={className} style={{ color: ICON_COLORS.rain }} />;
  }
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) {
    return <CloudSnow size={size} className={className} style={{ color: ICON_COLORS.snow }} />;
  }
  if (c.includes('mist') || c.includes('fog') || c.includes('haze') || c.includes('smoke') || c.includes('dust') || c.includes('sand')) {
    return <CloudFog size={size} className={className} style={{ color: ICON_COLORS.fog }} />;
  }
  if (c.includes('squall') || c.includes('tornado')) {
    return <Wind size={size} className={className} style={{ color: ICON_COLORS.wind }} />;
  }
  if (c.includes('cloud')) {
    if (c.includes('few') || c.includes('scattered') || c.includes('broken') || c.includes('partly')) {
      return <CloudSun size={size} className={className} style={{ color: ICON_COLORS.partlyCloudy }} />;
    }
    return <Cloud size={size} className={className} style={{ color: ICON_COLORS.clouds }} />;
  }

  return <Cloud size={size} className={className} style={{ color: ICON_COLORS.default }} />;
};

// Stat panel icons
export const StatIcons = {
  Humidity:   Droplets,
  Wind:       Wind,
  Pressure:   Gauge,
  Visibility: Eye,
  FeelsLike:  Waves,
  Cloudiness: Cloud,
  DewPoint:   Thermometer,
};
