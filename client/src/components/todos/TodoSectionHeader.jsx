export function TodoSectionHeader({ label }) {
  return (
    <div className="pt-8 first:pt-2">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
        {label}
      </h2>
      <div className="mt-2 border-b border-border" />
    </div>
  );
}
