import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { convertTemp } from '../utils/converters';

const CustomTooltip = ({ active, payload, label, unitLabel }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-[12px] text-[13px]"
      style={{
        background: 'rgba(8,12,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <p className="mb-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {p.value}{unitLabel}
        </p>
      ))}
    </div>
  );
};

export default function WeatherChart({ data = [], units }) {
  const unitLabel = units === 'metric' ? '°C' : '°F';

  const chartData = data.map(d => ({
    name: d.name ?? d.day,
    High: convertTemp(d.tempHigh ?? d.temperature ?? 0, units),
    Low:  convertTemp(d.tempLow  ?? (d.temperature ?? 0) - 6, units),
  }));

  return (
    <div className="glass p-8 rounded-[32px] flex flex-col gap-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-40">
        Temperature Trend
      </p>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="name"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}°`}
          />

          <Tooltip content={<CustomTooltip unitLabel={unitLabel} />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', paddingTop: 8 }}
          />

          <Area type="monotone" dataKey="High" stroke="#f59e0b" strokeWidth={2}
            fill="url(#gradHigh)" dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="Low"  stroke="#60a5fa" strokeWidth={2}
            fill="url(#gradLow)"  dot={{ r: 3, fill: '#60a5fa', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
