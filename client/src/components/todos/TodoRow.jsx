import { Link } from "react-router-dom";
import { appendListQuery } from "../../utils/listQueryParams.js";
import {
  formatDueDate,
  formatTagsLabel,
  getTodoStatusBadge,
} from "../../utils/todoHelpers.js";

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
  const statusBadge = getTodoStatusBadge(todo);
  const query = new URLSearchParams(listQueryString);
  const detailUrl = appendListQuery("/todos/" + todo._id, query);
  const editUrl = appendListQuery("/todos/" + todo._id + "/edit", new URLSearchParams(listQueryString));

  return (
    <article
      className={
        "setup-card-item" + (selected ? " setup-card-item-selected" : "")
      }
    >
      {selectionMode ? (
        <label className="selection-checkbox">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(todo._id)}
            aria-label={"Select " + todo.title}
          />
          Select task
        </label>
      ) : null}

      <div className="setup-details">
        <div className="template-type">
          <h3 className="setup-card-title">{todo.title}</h3>
          <span className={"badge-status " + statusBadge.className}>
            {statusBadge.label}
          </span>
        </div>

        <p className="setup-description">
          {todo.description || "No description provided."}
        </p>

        <div className="task-meta-grid">
          <span>Due: {formatDueDate(todo.dueDate) || "No due date"}</span>
          <span>Priority: {todo.priority || "medium"}</span>
          <span>Tags: {formatTagsLabel(todo.tags)}</span>
        </div>
      </div>

      <div className="accessory-view">
        <button
          type="button"
          className={"btn btn-sm " + (isCompleted ? "btn-secondary" : "btn-success")}
          onClick={() => onToggleComplete(todo._id)}
        >
          {isCompleted ? "Undo" : "Complete"}
        </button>

        <Link to={editUrl} className="btn btn-sm btn-secondary">
          Edit
        </Link>

        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(todo)}
        >
          Delete
        </button>

        <div className="btn-link-wrapper">
          <Link to={detailUrl} className="btn btn-sm btn-secondary">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
