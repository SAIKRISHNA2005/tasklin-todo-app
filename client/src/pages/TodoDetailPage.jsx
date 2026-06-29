import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";
import {
  clearCurrentTodo,
  deleteTodo,
  fetchTodoById,
} from "../features/todos/todosSlice.js";
import {
  buildListUrl,
  isValidObjectId,
} from "../utils/listQueryParams.js";
import {
  formatDateTime,
  formatDueDate,
  formatTagsLabel,
  getTodoStatusBadge,
} from "../utils/todoHelpers.js";
import { TodoNotFoundState } from "../components/todos/TodoNotFoundState.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";

export function TodoDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useToast();
  const { currentTodo } = useSelector((state) => state.todos);

  const [pageState, setPageState] = useState("loading");

  const backUrl = useMemo(() => buildListUrl(searchParams), [searchParams]);
  const querySuffix = searchParams.toString() ? "?" + searchParams.toString() : "";

  useEffect(() => {
    if (!id || !isValidObjectId(id)) {
      setPageState("not-found");
      return;
    }

    setPageState("loading");
    dispatch(clearCurrentTodo());

    dispatch(fetchTodoById(id))
      .unwrap()
      .then(() => setPageState("ready"))
      .catch(() => setPageState("not-found"));

    return () => {
      dispatch(clearCurrentTodo());
    };
  }, [id, dispatch]);

  const confirmDelete = useCallback(() => {
    if (!currentTodo) return;

    showConfirm({
      title: "Delete task?",
      message: "\"" + currentTodo.title + "\" will be permanently removed.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: async () => {
        try {
          await dispatch(deleteTodo(currentTodo._id)).unwrap();
          showSuccess("Task deleted.");
          navigate(backUrl);
        } catch (message) {
          showError(message);
        }
      },
    });
  }, [backUrl, currentTodo, dispatch, navigate, showConfirm, showError, showSuccess]);

  if (pageState === "loading" || (pageState === "ready" && !currentTodo)) {
    return (
      <div className="setup-container setup-container-narrow">
        <div className="setup-card details-content-card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="setup-container setup-container-narrow">
        <TodoNotFoundState backUrl={backUrl} />
      </div>
    );
  }

  const statusBadge = getTodoStatusBadge(currentTodo);

  return (
    <div className="setup-container setup-container-narrow">
      <div className="details-header-bar">
        <h1>Todo Details</h1>
        <Link to={backUrl} className="btn btn-secondary">
          Back to Todo List
        </Link>
      </div>

      <div className="setup-card details-content-card">
        <div className="template-type">
          <h2 className="setup-card-title">{currentTodo.title}</h2>
          <span className={"badge-status " + statusBadge.className}>
            {statusBadge.label}
          </span>
        </div>

        <div className="setup-details-container">
          <div className="details-meta-item">
            <span className="meta-label">Description</span>
            <p className="meta-value meta-value-plain">
              {currentTodo.description || "No description provided."}
            </p>
          </div>

          <div className="details-meta-grid">
            <div className="details-meta-item">
              <span className="meta-label">Due Date</span>
              <p className="meta-value">
                {formatDueDate(currentTodo.dueDate) || "No due date"}
              </p>
            </div>

            <div className="details-meta-item">
              <span className="meta-label">Priority</span>
              <p className="meta-value">{currentTodo.priority || "medium"}</p>
            </div>

            <div className="details-meta-item">
              <span className="meta-label">Tags</span>
              <p className="meta-value meta-value-plain">
                {formatTagsLabel(currentTodo.tags)}
              </p>
            </div>

            <div className="details-meta-item">
              <span className="meta-label">Created</span>
              <p className="meta-value meta-value-plain">
                {formatDateTime(currentTodo.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="accessory-view">
          <Link
            to={"/todos/" + currentTodo._id + "/edit" + querySuffix}
            className="btn btn-sm btn-secondary"
          >
            Edit
          </Link>
          <button type="button" onClick={confirmDelete} className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div
        className="accessory-view"
        style={{
          borderBlockStart: "none",
          paddingBlockStart: 0,
          marginBlockStart: "var(--space-16)",
        }}
      >
        <Link to={backUrl} className="btn btn-primary">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}
