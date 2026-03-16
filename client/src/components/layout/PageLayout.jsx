/**
 * Two-column responsive grid layout for SkyCast.
 * Usage:
 *   <PageLayout left={<MainContent />} right={<Sidebar />} />
 *   <PageLayout fullWidth>...</PageLayout>
 */
export default function PageLayout({ left, right, fullWidth, children }) {
  if (fullWidth || children) {
    return (
      <div className="max-w-[1140px] mx-auto px-5 py-8">
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-8">
      <div
        className="grid gap-4 md:grid-cols-[1fr_340px]"
      >
        <div className="flex flex-col gap-4 min-w-0">{left}</div>
        <aside className="flex flex-col gap-4 min-w-0">{right}</aside>
      </div>
    </div>
  );
}
