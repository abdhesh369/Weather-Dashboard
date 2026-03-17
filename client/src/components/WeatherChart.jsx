import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { convertTemp } from '../utils/converters';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

const METRICS = [
  { id: 'temp',    label: 'Temperature', Icon: Thermometer },
  { id: 'precip',  label: 'Precip',      Icon: CloudRain   },
  { id: 'humidity',label: 'Humidity',    Icon: Droplets    },
  { id: 'wind',    label: 'Wind',        Icon: Wind        },
];

const CustomTooltip = ({ active, payload, label, suffix }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-[12px] text-[13px]"
      style={{ background: 'rgba(8,12,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
      <p className="mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color ?? p.fill, fontWeight: 700 }}>
          {p.name}: {p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

export default function WeatherChart({ data = [], units }) {
  const [metric, setMetric] = useState('temp');
  const unitLabel = units === 'metric' ? '°C' : '°F';

  const chartData = data.map(d => ({
    name:     d.name ?? d.day,
    High:     convertTemp(d.tempHigh ?? d.temperature ?? 0, units),
    Low:      convertTemp(d.tempLow ?? (d.temperature ?? 0) - 6, units),
    Humidity: d.humidity ?? 0,
    Precip:   d.precipMm ?? 0,
    Wind:     d.wind ?? 0,
    Pop:      d.pop ?? 0,
  }));

  const renderChart = () => {
    switch (metric) {
      case 'temp':
        return (
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}°`} />
            <Tooltip content={<CustomTooltip suffix={unitLabel} />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area type="natural" dataKey="High" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradHigh)" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="natural" dataKey="Low"  stroke="#60a5fa" strokeWidth={2.5} fill="url(#gradLow)"  dot={{ r: 4, fill: '#60a5fa', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        );

      case 'precip':
        return (
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="Pop" name="Rain chance" fill="url(#gradPrecip)" radius={[6, 6, 0, 0]}>
              <defs>
                <linearGradient id="gradPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        );

      case 'humidity':
        return (
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area type="natural" dataKey="Humidity" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gradHum)" dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        );

      case 'wind':
        return (
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gradWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
            <Tooltip content={<CustomTooltip suffix=" m/s" />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area type="natural" dataKey="Wind" stroke="#a78bfa" strokeWidth={2.5} fill="url(#gradWind)" dot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass glass-interactive rounded-[32px] flex flex-col gap-6" style={{ padding: '40px' }}>
      {/* Header + tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-40">Forecast Trend</p>
        <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {METRICS.map(({ id, label, Icon }) => {
            const active = metric === id;
            return (
              <motion.button
                key={id}
                onClick={() => setMetric(id)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer border-none"
                style={{
                  background: active ? 'var(--brand-primary)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={metric}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <ResponsiveContainer width="100%" height={200}>
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
