export function TodoSectionHeader({ label, count }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="section-label">{label}</h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      {count != null ? (
        <span className="rounded-md bg-surface-alt px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-faint">
          {count}
        </span>
      ) : null}
    </div>
  );
}
