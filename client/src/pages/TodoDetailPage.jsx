import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";
import {
  clearCurrentTodo,
  fetchTodoById,
  updateTodo,
  deleteTodo,
} from "../features/todos/todosSlice.js";
import {
  buildTodoPayload,
  formatDueDateForInput,
  formatTagsForInput,
  todoFormSchema,
} from "../lib/validations/todoSchema.js";
import {
  buildListUrl,
  isValidObjectId,
} from "../utils/listQueryParams.js";
import {
  getDueDateClassName,
  getPriorityClassName,
  getPriorityLabel,
} from "../utils/todoHelpers.js";
import { TodoActivityTimeline } from "../components/todos/TodoActivityTimeline.jsx";
import { TodoNotFoundState } from "../components/todos/TodoNotFoundState.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";
import {
  InlineDateField,
  InlineSelectField,
  InlineTagsField,
  InlineTextArea,
  InlineTextField,
} from "../components/todos/InlineEditableField.jsx";

function getStatusLabel(status) {
  return status === "completed" ? "Done" : "Active";
}

function getStatusClassName(status) {
  return status === "completed" ? "text-status-done" : "text-text-muted";
}

export function TodoDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useToast();
  const { currentTodo, actionLoading } = useSelector((state) => state.todos);

  const [pageState, setPageState] = useState("loading");

  const backUrl = useMemo(() => buildListUrl(searchParams), [searchParams]);
  const querySuffix = searchParams.toString() ? "?" + searchParams.toString() : "";

  const formValues = useMemo(() => {
    if (!currentTodo) {
      return null;
    }

    return {
      title: currentTodo.title || "",
      description: currentTodo.description || "",
      dueDate: formatDueDateForInput(currentTodo.dueDate),
      priority: currentTodo.priority || "medium",
      tags: formatTagsForInput(currentTodo.tags),
    };
  }, [currentTodo]);

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

  const saveField = useCallback(
    async (field, value) => {
      if (!currentTodo || !formValues) {
        throw new Error("Task is not available.");
      }

      const nextValues = { ...formValues, [field]: value };
      const parsed = todoFormSchema.safeParse(nextValues);

      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message || "Invalid value.";
        showError(message);
        throw message;
      }

      const payload = buildTodoPayload(parsed.data, currentTodo.status);

      try {
        await dispatch(
          updateTodo({ id: currentTodo._id, todo: payload })
        ).unwrap();
        showSuccess("Task updated.");
      } catch (message) {
        showError(message);
        throw message;
      }
    },
    [currentTodo, formValues, dispatch, showSuccess, showError]
  );

  const saveStatus = useCallback(
    async (status) => {
      if (!currentTodo || !formValues) {
        throw new Error("Task is not available.");
      }

      const payload = buildTodoPayload(formValues, status);

      try {
        await dispatch(
          updateTodo({ id: currentTodo._id, todo: payload })
        ).unwrap();
        showSuccess("Task updated.");
      } catch (message) {
        showError(message);
        throw message;
      }
    },
    [currentTodo, formValues, dispatch, showSuccess, showError]
  );

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

  const backLink = (
    <Link to={backUrl} className="btn-ghost -ml-2 gap-1.5 !px-2">
      <ArrowLeft size={15} />
      Back
    </Link>
  );

  if (pageState === "loading" || (pageState === "ready" && !currentTodo)) {
    return (
      <section className="space-y-6">
        {backLink}
        <div className="todo-card-grid max-w-sm">
          <TodoRowSkeleton />
        </div>
      </section>
    );
  }

  if (pageState === "not-found") {
    return (
      <section className="space-y-6">
        {backLink}
        <TodoNotFoundState message="This task doesn't exist or may have been deleted." />
      </section>
    );
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {backLink}
        <div className="flex items-center gap-2">
          <Link to={"/todos/" + currentTodo._id + "/edit" + querySuffix} className="btn-secondary">
            <Pencil size={15} />
            Edit
          </Link>
          <button type="button" onClick={confirmDelete} className="btn-danger">
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      <div className="detail-bento">
        <div className="detail-main-card space-y-6">
          <header className="space-y-5 border-b border-border pb-6">
            <InlineTextField
              value={formValues.title}
              label="Title"
              placeholder="Untitled task"
              displayClassName="font-heading text-2xl font-semibold leading-tight tracking-tight text-text sm:text-3xl"
              inputClassName="font-heading text-2xl font-semibold sm:text-3xl"
              onSave={(value) => saveField("title", value)}
            />

            <div className="flex flex-wrap gap-2">
              <InlineSelectField
                value={currentTodo.status}
                label="Status"
                displayValue={getStatusLabel(currentTodo.status)}
                displayClassName={getStatusClassName(currentTodo.status)}
                options={[
                  { value: "pending", label: "Active" },
                  { value: "completed", label: "Done" },
                ]}
                onSave={saveStatus}
                pill
              />

              <InlineSelectField
                value={formValues.priority}
                label="Priority"
                displayValue={getPriorityLabel(formValues.priority)}
                displayClassName={getPriorityClassName(formValues.priority)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                onSave={(value) => saveField("priority", value)}
                pill
              />

              <InlineDateField
                value={formValues.dueDate}
                label="Due"
                displayClassName={getDueDateClassName(
                  currentTodo.dueDate,
                  currentTodo.status
                )}
                onSave={(value) => saveField("dueDate", value)}
                pill
              />
            </div>
          </header>

          <section className="space-y-2">
            <h2 className="section-label">Notes</h2>
            <InlineTextArea
              value={formValues.description}
              label="Description"
              placeholder="Add notes about this task..."
              onSave={(value) => saveField("description", value)}
            />
          </section>

          <section className="space-y-2">
            <h2 className="section-label">Tags</h2>
            <InlineTagsField
              value={formValues.tags}
              tags={currentTodo.tags}
              onSave={(value) => saveField("tags", value)}
            />
          </section>

          {actionLoading ? (
            <p className="text-xs text-text-faint">Saving...</p>
          ) : null}
        </div>

        <aside className="detail-side-card">
          <TodoActivityTimeline
            createdAt={currentTodo.createdAt}
            updatedAt={currentTodo.updatedAt}
          />
        </aside>
      </div>
    </article>
  );
}
