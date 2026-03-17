import { motion } from 'framer-motion';

export default function UnitToggle({ units, setUnits }) {
  const isMetric = units === 'metric';

  return (
    <div
      role="group"
      aria-label="Temperature units"
      className="relative flex items-center p-1 rounded-full cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
        width: '68px',
        height: '34px'
      }}
      onClick={() => setUnits(isMetric ? 'imperial' : 'metric')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setUnits(isMetric ? 'imperial' : 'metric');
        }
      }}
      tabIndex={0}
    >
      {/* Sliding Gradient Background */}
      <motion.div
        className="absolute top-1 bottom-1 w-[30px] rounded-full"
        style={{
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-purple))',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
        }}
        animate={{ 
          x: isMetric ? 2 : 34 
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Labels */}
      <div className="relative z-10 flex w-full justify-between px-2 pointer-events-none">
        <span 
          className="text-[13px] font-bold transition-colors duration-300"
          style={{ color: isMetric ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}
        >
          °C
        </span>
        <span 
          className="text-[13px] font-bold transition-colors duration-300"
          style={{ color: !isMetric ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}
        >
          °F
        </span>
      </div>
    </div>
  );
}
