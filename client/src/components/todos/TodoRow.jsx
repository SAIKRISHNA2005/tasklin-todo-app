import { Link } from "react-router-dom";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { appendListQuery } from "../../utils/listQueryParams.js";
import {
  formatDueDate,
  getDueDateClassName,
  getPriorityClassName,
  getPriorityLabel,
} from "../../utils/todoHelpers.js";

function getPriorityDotClass(priority) {
  switch (priority) {
    case "high":
      return "priority-dot-high";
    case "medium":
      return "priority-dot-medium";
    default:
      return "priority-dot-low";
  }
}

export function TodoRow({
  todo,
  selectionMode,
  selected,
  listQueryString,
  onToggleSelect,
  onToggleComplete,
  onDelete,
}) {
  const isCompleted = todo.status === "completed";
  const dueDateLabel = formatDueDate(todo.dueDate);
  const query = new URLSearchParams(listQueryString);
  const detailUrl = appendListQuery("/todos/" + todo._id, query);
  const editUrl = appendListQuery("/todos/" + todo._id + "/edit", new URLSearchParams(listQueryString));

  return (
    <article
      className={cn(
        "todo-card group",
        isCompleted && "todo-card-completed"
      )}
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-0">
        <div className="flex items-center gap-2.5">
          <label
            className={cn(
              "flex items-center transition-all",
              selectionMode
                ? "w-auto opacity-100"
                : "w-0 overflow-hidden opacity-0 group-hover:w-auto group-hover:overflow-visible group-hover:opacity-100"
            )}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(todo._id)}
              className="h-4 w-4 rounded border-border-strong text-accent focus:ring-ring"
              aria-label={"Select " + todo.title}
            />
          </label>

          <button
            type="button"
            onClick={() => onToggleComplete(todo._id)}
            className={cn("todo-check", isCompleted && "todo-check-done")}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            {isCompleted ? <Check size={11} strokeWidth={3} /> : null}
          </button>
        </div>

        <span
          className={cn("todo-card-priority-dot mt-1", getPriorityDotClass(todo.priority))}
          title={getPriorityLabel(todo.priority) + " priority"}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Link
            to={detailUrl}
            className={cn(
              "block font-heading text-[1.0625rem] font-semibold leading-snug text-text transition-colors hover:text-accent-warm",
              isCompleted && "text-text-muted line-through decoration-text-faint"
            )}
          >
            {todo.title}
          </Link>
          {todo.description ? (
            <p
              className={cn(
                "line-clamp-2 text-sm leading-relaxed text-text-muted",
                isCompleted && "line-through decoration-text-faint"
              )}
            >
              {todo.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {dueDateLabel ? (
            <span
              className={cn(
                "meta-chip",
                getDueDateClassName(todo.dueDate, todo.status)
              )}
            >
              {dueDateLabel}
            </span>
          ) : null}
          <span className={cn("meta-chip", getPriorityClassName(todo.priority))}>
            {getPriorityLabel(todo.priority)}
          </span>
          {todo.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
          {todo.tags?.length > 3 ? (
            <span className="tag-chip">+{todo.tags.length - 3}</span>
          ) : null}
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-border bg-surface-alt/50 px-3 py-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Link
          to={detailUrl}
          className="text-xs font-medium text-text-muted transition-colors hover:text-accent-warm"
        >
          Open
        </Link>
        <div className="flex items-center gap-0.5">
          <Link
            to={editUrl}
            className="btn-icon"
            aria-label={"Edit " + todo.title}
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(todo)}
            className="btn-icon btn-icon-danger"
            aria-label={"Delete " + todo.title}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </footer>
    </article>
  );
}
