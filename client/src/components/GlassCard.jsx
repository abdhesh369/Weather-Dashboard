/**
 * Lightweight glass card — single source of truth for all card surfaces.
 * Replaces LiquidGlassCard for static, non-draggable content.
 */
export default function GlassCard({ children, className = '', style = {}, padding = '28px 32px' }) {
  return (
    <div
      className={`glass rounded-[24px] ${className}`}
      style={{
        padding,
        ...style,
      }}
    >
      {children}
    </div>
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
