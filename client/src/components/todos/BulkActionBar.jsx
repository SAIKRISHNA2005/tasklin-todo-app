export function BulkActionBar({
  selectedCount,
  actionLoading,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkDelete,
}) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 -mx-6 border-b border-border bg-background px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {selectedCount} selected
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Select all on page
          </button>
          <button
            type="button"
            onClick={onClearSelection}
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={onBulkComplete}
            className="text-sm font-medium text-accent transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Mark complete
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={onBulkDelete}
            className="text-sm font-medium text-status-overdue transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
