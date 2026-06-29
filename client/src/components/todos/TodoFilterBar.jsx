import { CheckSquare, SlidersHorizontal } from "lucide-react";
import { cn } from "../../lib/utils.js";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Active" },
  { value: "completed", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Any priority" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "dueDate", label: "Due soonest" },
  { value: "-dueDate", label: "Due latest" },
  { value: "-priority", label: "Priority ↓" },
  { value: "priority", label: "Priority ↑" },
];

function PillGroup({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <span className="section-label">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "filter-pill",
              value === option.value && "filter-pill-active"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="filter-select-wrap min-w-0 flex-1 sm:min-w-[8.5rem] sm:flex-none">
      <span className="section-label">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="filter-select"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PillGroup
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />
        <button
          type="button"
          onClick={onToggleSelectionMode}
          className={cn(
            "btn-secondary shrink-0 gap-1.5 !py-1.5 text-sm",
            selectionMode && "!border-accent !bg-accent !text-surface"
          )}
        >
          <CheckSquare size={14} />
          {selectionMode ? "Cancel" : "Select"}
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Priority"
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={onPriorityChange}
        />
        {availableTags.length > 0 ? (
          <FilterSelect
            label="Tag"
            value={tag}
            options={tagOptions}
            onChange={onTagChange}
          />
        ) : null}
        <FilterSelect
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>

      <div className="flex items-center gap-1.5 border-t border-border pt-3 text-text-faint">
        <SlidersHorizontal size={12} />
        <span className="text-xs">Refine your view</span>
      </div>
    </div>
  );
}
