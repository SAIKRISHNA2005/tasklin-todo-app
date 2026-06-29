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
      <p className="bulk-bar-label">{selectedCount} selected</p>

      <div className="bulk-bar-actions">
        <button type="button" onClick={onSelectAll} className="btn btn-sm btn-secondary">
          All on page
        </button>
        <button type="button" onClick={onClearSelection} className="btn btn-sm btn-secondary">
          Clear
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={onBulkComplete}
          className="btn btn-sm btn-success"
        >
          Complete
        </button>
        <button
          type="button"
          disabled={actionLoading}
          onClick={onBulkDelete}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
