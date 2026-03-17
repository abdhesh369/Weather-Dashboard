import { motion } from 'framer-motion';

const containerVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Two-column layout (main + sidebar) on desktop,
 * sidebar-first single column on mobile.
 *
 * Extra bottom padding accounts for the mobile bottom nav bar.
 */
export default function PageLayout({ left, right, fullWidth, children }) {
  const wrapClass = 'max-w-[1200px] mx-auto px-4 sm:px-6 w-full';
  const topPad    = { paddingTop: 'clamp(96px, 13vw, 128px)', paddingBottom: '120px' };

  if (fullWidth || children) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className={wrapClass} style={topPad}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className={wrapClass} style={topPad}>
      {/*
        Desktop: 2-col grid [main | sidebar]
        Mobile:  1-col — sidebar appears below main
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 lg:gap-8 items-start">
        {/* ── Main column ── */}
        <div className="flex flex-col gap-5 min-w-0">
          {left}
        </div>

        {/* ── Sidebar ── sticky on desktop */}
        <aside className="flex flex-col gap-4 min-w-0 lg:sticky lg:top-28">
          {right}
        </aside>
      </div>
    </motion.div>
  );
}
