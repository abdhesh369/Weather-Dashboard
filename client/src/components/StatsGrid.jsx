import { Wind, Droplets, Sun, Eye, Compass, CloudRain } from 'lucide-react';
import StatCard from './StatCard';
import { convertWind } from '../utils/converters';

export default function StatsGrid({ weatherData, units }) {
  const { current } = weatherData;

  // Mock data/Placeholders for missing API fields (enhance later if API supports)
  const stats = [
    {
      icon: <Wind size={20} />,
      label: 'Wind Speed',
      value: current.windSpeed,
      unit: units === 'metric' ? 'm/s' : 'mph',
      description: 'Direction: Southwest',
      trend: 'up',
      trendValue: '+2%'
    },
    {
      icon: <Droplets size={20} />,
      label: 'Humidity',
      value: current.humidity,
      unit: '%',
      description: 'The dew point is 12° right now',
    },
    {
      icon: <Sun size={20} />,
      label: 'UV Index',
      value: '4',
      unit: 'Moderate',
      description: 'Use sun protection until 4 PM',
      trendValue: 'Low'
    },
    {
      icon: <Eye size={20} />,
      label: 'Visibility',
      value: '10',
      unit: 'km',
      description: 'Perfectly clear view',
    },
    {
      icon: <Compass size={20} />,
      label: 'Pressure',
      value: '1012',
      unit: 'hPa',
      description: 'Falling slowly',
      trend: 'down',
      trendValue: '-1.2'
    },
    {
      icon: <CloudRain size={20} />,
      label: 'Precipitation',
      value: '0',
      unit: 'mm',
      description: '0.2 mm expected in next 24h',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
