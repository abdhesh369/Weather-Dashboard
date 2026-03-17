import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Smoothly animates a numeric value change.
 * Starts at the initial value without animating from 0.
 */
export default function AnimatedCounter({ value, format = v => Math.round(v) }) {
  const initialised = useRef(false);

  const spring = useSpring(value, {
    stiffness: 60,
    damping:   18,
    mass:      0.8,
    bounce:    0,
  });

  const display = useTransform(spring, format);

  useEffect(() => {
    if (!initialised.current) {
      // Snap to initial value — no entry animation from 0
      spring.jump(value);
      initialised.current = true;
    } else {
      spring.set(value);
    }
  }, [value, spring]);

  if (typeof value !== 'number') return <span>{value}</span>;
  return <motion.span>{display}</motion.span>;
}
