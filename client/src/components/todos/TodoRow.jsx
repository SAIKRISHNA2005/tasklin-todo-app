import { Link } from "react-router-dom";
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { appendListQuery } from "../../utils/listQueryParams.js";
import {
  formatDueDate,
  getDueDateClassName,
  getPriorityClassName,
  getPriorityLabel,
} from "../../utils/todoHelpers.js";

export function TodoRow({
  todo,
  selectionMode,
  selected,
  listQueryString,
  onToggleSelect,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const isCompleted = todo.status === "completed";
  const dueDateLabel = formatDueDate(todo.dueDate);

  return (
    <article
      className={cn(
        "group border border-border bg-surface px-4 py-4 transition-colors",
        isCompleted && "text-text-muted"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 items-center gap-3 pt-0.5">
          <label
            className={cn(
              "flex items-center",
              selectionMode
                ? "opacity-100"
                : "opacity-0 transition-opacity group-hover:opacity-100"
            )}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(todo._id)}
              className="h-4 w-4 rounded-sm border-border text-accent focus:ring-accent"
              aria-label={`Select ${todo.title}`}
            />
          </label>

          <button
            type="button"
            onClick={() => onToggleComplete(todo._id)}
            className="text-text-muted transition-colors hover:text-accent"
            aria-label={
              isCompleted ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {isCompleted ? (
              <Check size={18} className="text-status-done" />
            ) : (
              <Circle size={18} />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link
                to={appendListQuery(
                  `/todos/${todo._id}`,
                  new URLSearchParams(listQueryString)
                )}
                className={cn(
                  "block font-medium text-text hover:text-accent",
                  isCompleted && "line-through text-text-muted"
                )}
              >
                {todo.title}
              </Link>
              {todo.description ? (
                <p
                  className={cn(
                    "text-sm text-text-muted",
                    isCompleted && "line-through"
                  )}
                >
                  {todo.description}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-start gap-3">
              <div className="flex flex-col items-end gap-1 text-right">
                {dueDateLabel ? (
                  <span
                    className={cn(
                      "text-xs",
                      getDueDateClassName(todo.dueDate, todo.status)
                    )}
                  >
                    {dueDateLabel}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs",
                    getPriorityClassName(todo.priority)
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {getPriorityLabel(todo.priority)}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEdit(todo)}
                  className="p-1 text-text-muted transition-colors hover:text-accent"
                  aria-label={`Edit ${todo.title}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(todo)}
                  className="p-1 text-text-muted transition-colors hover:text-status-overdue"
                  aria-label={`Delete ${todo.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {todo.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface-alt px-2.5 py-0.5 text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
