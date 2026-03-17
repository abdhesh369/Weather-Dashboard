import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Wind } from 'lucide-react';

const CLOUD_PATHS = [
  { delay: 0,   speed: 18, y: '15%', scale: 1,    opacity: 0.06 },
  { delay: -6,  speed: 26, y: '45%', scale: 0.7,  opacity: 0.04 },
  { delay: -12, speed: 20, y: '70%', scale: 1.2,  opacity: 0.05 },
];

function DriftingCloud({ delay, speed, y, scale, opacity }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: y, scale, opacity }}
      animate={{ x: ['-20%', '120%'] }}
      transition={{ duration: speed, delay, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="240" height="80" viewBox="0 0 240 80" fill="white">
        <ellipse cx="120" cy="55" rx="100" ry="25" />
        <ellipse cx="80"  cy="45" rx="55"  ry="30" />
        <ellipse cx="150" cy="42" rx="60"  ry="33" />
        <ellipse cx="110" cy="35" rx="40"  ry="25" />
      </svg>
    </motion.div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Drifting clouds background */}
      {CLOUD_PATHS.map((c, i) => <DriftingCloud key={i} {...c} />)}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1,  y: 0  }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-sm relative z-10"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-[28px] flex items-center justify-center mx-auto mb-8 relative"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="absolute inset-0 bg-brand-primary/10 blur-2xl rounded-[28px]" />
          <Wind size={38} style={{ color: 'rgba(255,255,255,0.35)' }} />
        </motion.div>

        {/* Code */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-bold text-white leading-none mb-3"
          style={{ fontSize: 'clamp(64px, 12vw, 96px)', textShadow: 'var(--text-shadow-md)' }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-[20px] font-bold mb-2 text-white"
        >
          Page not found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="text-[14px] mb-10 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.38)' }}
        >
          Looks like this page drifted off into the clouds.<br />
          The forecast doesn't look great for finding it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/">
            <motion.span
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[16px] text-[15px] font-bold text-white cursor-pointer shadow-lg shadow-brand-primary/25"
              style={{ background: 'var(--brand-primary)' }}
            >
              <Home size={16} /> Back to Dashboard
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
