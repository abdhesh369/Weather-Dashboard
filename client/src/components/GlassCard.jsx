/**
 * Lightweight glass card — single source of truth for all card surfaces.
 * Replaces LiquidGlassCard for static, non-draggable content.
 */
export default function GlassCard({ children, className = '', style = {}, padding = '20px 24px' }) {
  return (
    <div
      className={`rounded-[20px] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
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
