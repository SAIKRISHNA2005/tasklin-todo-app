export function TodoRowSkeleton() {
  return (
    <div className="todo-card flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="skeleton-shimmer h-5 w-5 rounded-full" />
        <div className="skeleton-shimmer h-2 w-2 rounded-full" />
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="skeleton-shimmer h-4 w-3/5" />
        <div className="skeleton-shimmer h-3 w-full" />
        <div className="skeleton-shimmer h-3 w-4/5" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="skeleton-shimmer h-5 w-14 rounded-md" />
        <div className="skeleton-shimmer h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}
