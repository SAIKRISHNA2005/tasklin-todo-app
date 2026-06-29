import { TodoSearchBar } from "./TodoSearchBar.jsx";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Any priority" },
  { value: "high", label: "High priority" },
  { value: "medium", label: "Medium priority" },
  { value: "low", label: "Low priority" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "dueDate", label: "Sort by due date" },
  { value: "-dueDate", label: "Due latest" },
  { value: "-priority", label: "Sort by priority" },
  { value: "priority", label: "Priority ascending" },
];

export function TodoFilterBar({
  search,
  onSearchChange,
  status,
  priority,
  tag,
  sort,
  availableTags,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onSortChange,
  selectionMode,
  onToggleSelectionMode,
}) {
  const tagOptions = [
    { value: "", label: "All tags" },
    ...availableTags.map((item) => ({ value: item, label: item })),
  ];

  return (
    <div className="controls-bar">
      <TodoSearchBar value={search} onChange={onSearchChange} />

      <select
        className="setup-select filter-select-field"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="setup-select filter-select-field"
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value || "any"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {availableTags.length > 0 ? (
        <select
          className="setup-select filter-select-field"
          value={tag}
          onChange={(event) => onTagChange(event.target.value)}
          aria-label="Filter by tag"
        >
          {tagOptions.map((option) => (
            <option key={option.value || "all-tags"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      <select
        className="setup-select filter-select-field"
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        aria-label="Sort tasks"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onToggleSelectionMode}
      >
        {selectionMode ? "Cancel select" : "Select tasks"}
      </button>
    </div>
  );
}
