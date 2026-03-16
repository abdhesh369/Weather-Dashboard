export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full anim-fade-in">
      {/* Hero skeleton */}
      <div className="skeleton rounded-[28px]" style={{ height: 280 }} />

      {/* Hourly skeleton */}
      <div className="skeleton rounded-[20px]" style={{ height: 108 }} />

      {/* Chart skeleton */}
      <div className="skeleton rounded-[20px]" style={{ height: 220 }} />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton rounded-[14px]" style={{ height: 90 }} />
        ))}
      </div>
    </div>
  );
}
