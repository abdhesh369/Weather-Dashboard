import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CloudOff } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div
          className="w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <CloudOff size={36} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </div>
        <h1 className="text-[40px] font-bold text-white leading-none mb-2">404</h1>
        <p className="text-[18px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Page not found
        </p>
        <p className="text-[14px] mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Looks like this page drifted off into the clouds.
        </p>
        <Link to="/">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] text-[15px] font-semibold text-white cursor-pointer"
            style={{ background: 'var(--brand-primary)' }}
          >
            <Home size={16} /> Back to dashboard
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
