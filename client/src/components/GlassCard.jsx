import { motion } from 'framer-motion';

/**
 * Lightweight glass card — single source of truth for all card surfaces.
 * Replaces LiquidGlassCard for static, non-draggable content.
 */
export default function GlassCard({ children, className = '', style = {}, padding = '40px 48px' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass glass-interactive rounded-[24px] ${className}`}
      style={{
        padding,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export function CardTitle({ children }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-[0.07em] mb-4"
      style={{ color: 'rgba(255,255,255,0.38)' }}
    >
      {children}
    </p>
  );
}
