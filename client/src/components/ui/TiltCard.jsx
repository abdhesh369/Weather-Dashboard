import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 3-D tilt card wrapper.
 * Automatically disabled on touch-only devices to avoid
 * sticky tilt states after taps.
 */
export default function TiltCard({ children, className = '', maxDeg = 5, ...props }) {
  const hasFinePointer = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: fine)').matches
    : true;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xS = useSpring(x, { stiffness: 100, damping: 22, mass: 0.6 });
  const yS = useSpring(y, { stiffness: 100, damping: 22, mass: 0.6 });
  const rotateX = useTransform(yS, [-0.5, 0.5], [`${maxDeg}deg`, `-${maxDeg}deg`]);
  const rotateY = useTransform(xS, [-0.5, 0.5], [`-${maxDeg}deg`, `${maxDeg}deg`]);

  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!hasFinePointer) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width  - 0.5);
      y.set((e.clientY - r.top)  / r.height - 0.5);
    });
  };

  const reset = () => { x.set(0); y.set(0); };

  if (!hasFinePointer) {
    return <div className={`relative ${className}`} {...props}>{children}</div>;
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={`relative ${className}`}
      {...props}
    >
      <div style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
