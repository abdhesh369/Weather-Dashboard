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
  Compass,
  CloudFog
} from 'lucide-react';

/**
 * Maps OpenWeatherMap condition strings to Lucide icons.
 */
export function getWeatherIcon(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('clear')) return Sun;
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain;
  if (c.includes('snow')) return CloudSnow;
  if (c.includes('thunder')) return CloudLightning;
  if (c.includes('cloud')) {
    if (c.includes('few') || c.includes('scattered')) return CloudSun;
    return Cloud;
  }
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return CloudFog;
  return Cloud;
}

/**
 * Formats a timestamp into a readable date or time.
 */
export function formatWeatherDate(date, options = {}) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/**
 * Maps condition to a display name.
 */
export function formatCondition(condition = '') {
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}
