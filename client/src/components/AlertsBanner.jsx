import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function AlertsBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (alerts.length === 0 || dismissed) return null;

  const mainAlert = alerts[0];
  const isExtreme = mainAlert.event?.toLowerCase().includes('extreme') || mainAlert.severity === 'Severe';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div 
          className="mx-auto max-w-[1100px] mb-4 p-6 rounded-[18px] flex items-center justify-between gap-4 border"
          style={{ 
            background: isExtreme ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
            borderColor: isExtreme ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: isExtreme ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)' }}
            >
              <AlertTriangle size={16} className={isExtreme ? 'text-red-400' : 'text-amber-400'} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white leading-tight">
                {mainAlert.event || 'Weather Alert'}
              </span>
              <span className="text-[11px] text-white/50 font-medium">
                {mainAlert.description?.slice(0, 100)}...
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setDismissed(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-white/30 hover:text-white transition-colors border-none cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
