import { motion } from 'framer-motion';

export default function StatCard({ 
  icon, 
  label, 
  value, 
  unit, 
  description, 
  trend, 
  trendValue 
}) {
  return (
    <div 
      className="p-7 rounded-[24px] flex flex-col gap-4 transition-all duration-300 hover:translate-y-[-4px]"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary border border-white/5">
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            trend === 'up' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
          }`}>
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1">
          {label}
        </h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm font-medium text-white/40">{unit}</span>
        </div>
      </div>

      {description && (
        <p className="text-[12px] font-medium text-white/40 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}
