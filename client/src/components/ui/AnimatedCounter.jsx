import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ value, format = (v) => Math.round(v), duration = 1.5 }) {
  const [hasMounted, setHasMounted] = useState(false);
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
    stiffness: 50,
    damping: 20
  });

  const displayValue = useTransform(springValue, (current) => format(current));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && typeof value === 'number') {
      springValue.set(value);
    }
  }, [value, hasMounted, springValue]);

  // Fallback for non-numbers or before mount
  if (typeof value !== 'number' || !hasMounted) {
    return <span>{typeof value === 'number' ? format(value) : value}</span>;
  }

  return <motion.span>{displayValue}</motion.span>;
}
