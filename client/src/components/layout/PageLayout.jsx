import { motion } from 'framer-motion';

export default function PageLayout({ left, right, fullWidth, children }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (fullWidth || children) {
    return (
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="max-w-[1100px] mx-auto px-6"
        style={{ paddingTop: '130px', paddingBottom: '40px' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants} initial="hidden" animate="visible"
      className="max-w-[1100px] mx-auto px-6"
      style={{ paddingTop: '130px', paddingBottom: '40px' }}
    >
      <div className="grid gap-8" style={{ gridTemplateColumns: 'minmax(0,1fr) 320px' }}>
        <div className="flex flex-col gap-6 min-w-0">{left}</div>
        <aside className="flex flex-col gap-6 min-w-0">{right}</aside>
      </div>
    </motion.div>
  );
}
