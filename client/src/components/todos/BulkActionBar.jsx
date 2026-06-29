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
    <div className="bulk-bar">
      <p className="text-sm font-semibold">
        {selectedCount} selected
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onSelectAll} className="btn-ghost text-sm">
          All on page
        </button>
        <button type="button" onClick={onClearSelection} className="btn-ghost text-sm">
          Clear
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={onBulkComplete}
          className="btn-secondary !py-1.5 text-sm"
        >
          Complete
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={onBulkDelete}
          className="btn-danger text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
