import { Plus, SearchX } from "lucide-react";

export function TodoEmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-alt/40 px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-raised text-text-faint shadow-sm">
        <SearchX size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-semibold text-text">
        Nothing here
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
        No tasks match your current filters. Try adjusting them or add something new.
      </p>
      {onCreateClick ? (
        <button
          type="button"
          onClick={onCreateClick}
          className="btn-primary mt-7 gap-2"
        >
          <Plus size={15} />
          Add a task
        </button>
      ) : null}
    </div>
  );
}
