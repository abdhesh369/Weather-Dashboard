export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full anim-fade-in">
      {/* Hero skeleton */}
      <div className="skeleton skeleton-shimmer rounded-[32px]" style={{ height: 320 }} />

      {/* Hourly skeleton */}
      <div className="skeleton skeleton-shimmer rounded-[32px]" style={{ height: 120 }} />

      {/* Chart skeleton */}
      <div className="skeleton skeleton-shimmer rounded-[32px]" style={{ height: 260 }} />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton skeleton-shimmer rounded-[24px]" style={{ height: 140 }} />
        ))}
      </div>
    </div>
  );
}
