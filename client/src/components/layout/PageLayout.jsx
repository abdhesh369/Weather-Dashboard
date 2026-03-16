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
      <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0,1fr) 320px' }}
        // Responsive handled below via a style tag in index.css
      >
        <div className="flex flex-col gap-4 min-w-0">{left}</div>
        <aside className="flex flex-col gap-4 min-w-0">{right}</aside>
      </div>
    </div>
  );
}
