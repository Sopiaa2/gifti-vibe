export default function SkeletonCards() {
  return (
    <div className="px-4 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3 min-h-[80px] animate-pulse">
          <div className="w-10 h-8 bg-muted rounded" />
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </div>
          <div className="w-14 h-14 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
