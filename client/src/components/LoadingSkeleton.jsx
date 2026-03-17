import { motion } from 'framer-motion';

function SkeletonBox({ h, rounded = '[32px]', className = '' }) {
  return (
    <div
      className={`skeleton skeleton-shimmer rounded-${rounded} ${className}`}
      style={{ height: h }}
    />
  );
}

function SkeletonText({ w = 'w-1/2', h = 16 }) {
  return (
    <div
      className={`skeleton skeleton-shimmer rounded-full ${w}`}
      style={{ height: h }}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-5 w-full"
    >
      {/* HeroCard skeleton */}
      <div className="skeleton skeleton-shimmer rounded-[32px] relative overflow-hidden" style={{ height: 320 }}>
        <div className="absolute inset-0 p-14 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-4 flex-1">
              <SkeletonText w="w-32" h={20} />
              <SkeletonText w="w-48" h={80} />
              <SkeletonText w="w-36" h={16} />
            </div>
            <div className="skeleton rounded-full" style={{ width: 80, height: 80 }} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            {[1, 2, 3].map(i => (
              <SkeletonBox key={i} h={56} rounded="[16px]" className="flex-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="glass rounded-[32px] p-10">
        <SkeletonText w="w-28" h={12} />
        <div className="flex gap-2 mt-5 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton rounded-[16px] shrink-0" style={{ width: 72, height: 112 }} />
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="glass rounded-[32px] p-10">
        <div className="flex items-center justify-between mb-5">
          <SkeletonText w="w-32" h={12} />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton rounded-full" style={{ width: 72, height: 28 }} />
            ))}
          </div>
        </div>
        <SkeletonBox h={200} rounded="[16px]" />
      </div>

      {/* Stats skeleton */}
      <div className="flex flex-col gap-4">
        <SkeletonBox h={60} rounded="[20px]" />
        <SkeletonBox h={48} rounded="[20px]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <SkeletonBox key={i} h={140} rounded="[24px]" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
