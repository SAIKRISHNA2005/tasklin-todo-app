export function TodoRowSkeleton() {
  return (
    <div className="border border-border bg-surface px-4 py-4">
      <div className="flex items-start gap-4">
        <div className="skeleton-shimmer mt-1 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="skeleton-shimmer h-4 w-2/5 max-w-xs" />
          <div className="skeleton-shimmer h-3 w-3/5 max-w-sm" />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-5 w-14 rounded-full" />
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="skeleton-shimmer h-4 w-16" />
      </div>
    </div>
  );
}
