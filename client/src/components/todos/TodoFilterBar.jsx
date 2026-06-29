import { cn } from "../../lib/utils.js";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Active" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Created (newest)" },
  { value: "createdAt", label: "Created (oldest)" },
  { value: "dueDate", label: "Due date (soonest)" },
  { value: "-dueDate", label: "Due date (latest)" },
  { value: "-priority", label: "Priority (high first)" },
  { value: "priority", label: "Priority (low first)" },
];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-[0.12em] text-text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-[9rem] border-0 border-b border-border bg-transparent px-0 py-1.5 text-sm text-text shadow-none focus:border-accent focus:ring-0"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TodoFilterBar({
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
    <div className="flex flex-col gap-4 border-b border-border pb-4">
      <div className="flex flex-wrap items-end gap-4">
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />
        <FilterSelect
          label="Priority"
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={onPriorityChange}
        />
        <FilterSelect
          label="Tag"
          value={tag}
          options={tagOptions}
          onChange={onTagChange}
        />
        <FilterSelect
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSelectionMode}
          className={cn(
            "text-sm transition-colors",
            selectionMode
              ? "font-medium text-accent"
              : "text-text-muted hover:text-text"
          )}
        >
          {selectionMode ? "Exit selection" : "Select entries"}
        </button>
      </div>
    </div>
  );
}
