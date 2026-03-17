import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, Clock, BarChart2, Star, Sun } from 'lucide-react';

// Tab definitions with section IDs to scroll to
const TABS = [
  { id: 'now',     Icon: CloudSun,  label: 'Now',      section: 'section-hero'    },
  { id: 'hourly',  Icon: Clock,     label: 'Hourly',   section: 'section-hourly'  },
  { id: 'forecast',Icon: BarChart2, label: 'Forecast', section: 'section-chart'   },
  { id: 'details', Icon: Sun,       label: 'Details',  section: 'section-stats'   },
  { id: 'saved',   Icon: Star,      label: 'Saved',    section: 'section-sidebar' },
];

export default function MobileBottomTab({ activeTab, onTabChange }) {
  const scrollingRef = useRef(false);

  // Observe sections and update active tab on scroll
  useEffect(() => {
    const observers = [];

    TABS.forEach(({ id, section }) => {
      const el = document.getElementById(section);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !scrollingRef.current) {
            onTabChange(id);
          }
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [onTabChange]);

  const handleTabClick = (tab) => {
    onTabChange(tab.id);
    const el = document.getElementById(tab.section);
    if (!el) return;

    scrollingRef.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Unlock after scroll settles
    setTimeout(() => { scrollingRef.current = false; }, 800);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Safe-area spacer */}
      <div className="px-3 pb-[max(env(safe-area-inset-bottom),16px)] pt-2 pointer-events-auto">
        <div
          className="h-[60px] rounded-[22px] flex items-center justify-around px-1"
          style={{
            background:    'rgba(8,12,30,0.88)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full border-none bg-transparent cursor-pointer py-2 rounded-[16px] transition-colors"
                style={{ background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent' }}
              >
                {/* Active pill behind icon */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-1 rounded-[14px]"
                      style={{ background: 'rgba(99,102,241,0.15)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y:     isActive ? -1  : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative z-10"
                  style={{ color: isActive ? 'var(--brand-primary)' : 'rgba(255,255,255,0.38)' }}
                >
                  <tab.Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </motion.div>

                <span
                  className="relative z-10 text-[9px] font-bold uppercase tracking-wider leading-none"
                  style={{ color: isActive ? 'rgba(165,180,252,0.9)' : 'rgba(255,255,255,0.28)' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
