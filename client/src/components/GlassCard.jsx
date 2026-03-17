import { motion } from 'framer-motion';

/**
 * GlassCard — canonical glass surface.
 *
 * Used as a primitive for any card that needs the standard glass look.
 * Prefer this over manually writing glass styles in every component.
 */
export default function GlassCard({
  children,
  className  = '',
  style      = {},
  padding    = 'var(--card-padding-md, 36px)',
  hover      = true,
  rounded    = '32px',
  as         = 'div',
  ...props
}) {
  const Tag = hover ? motion.div : as;
  const hoverProps = hover
    ? {
        whileHover: { scale: 1.02, translateY: -6 },
        whileTap:   { scale: 0.98 },
        transition: { type: 'spring', stiffness: 350, damping: 25 },
      }
    : {};

  return (
    <Tag
      {...hoverProps}
      {...props}
      className={`glass glass-interactive rounded-[${rounded}] ${className}`}
      style={{ padding, ...style }}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-4 ${className}`}
      style={{ color: 'rgba(255,255,255,0.38)' }}>
      {children}
    </p>
  );
}

export function CardDivider() {
  return <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.06)' }} />;
}
