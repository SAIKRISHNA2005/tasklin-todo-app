import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";
import {
  clearCurrentTodo,
  fetchTodoById,
  updateTodo,
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
  return status === "completed" ? "Completed" : "Active";
}

function getStatusClassName(status) {
  return status === "completed" ? "text-status-done" : "text-text-muted";
}

export function TodoDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const { currentTodo, actionLoading } = useSelector((state) => state.todos);

  const [pageState, setPageState] = useState("loading");

  const backUrl = useMemo(() => buildListUrl(searchParams), [searchParams]);

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
        throw new Error("Entry is not available.");
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
        showSuccess("Entry updated.");
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
        throw new Error("Entry is not available.");
      }

      const payload = buildTodoPayload(formValues, status);

      try {
        await dispatch(
          updateTodo({ id: currentTodo._id, todo: payload })
        ).unwrap();
        showSuccess("Entry updated.");
      } catch (message) {
        showError(message);
        throw message;
      }
    },
    [currentTodo, formValues, dispatch, showSuccess, showError]
  );

  if (pageState === "loading" || (pageState === "ready" && !currentTodo)) {
    return (
      <section className="space-y-6">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Back to list
        </Link>
        <div className="space-y-2">
          <TodoRowSkeleton />
        </div>
      </section>
    );
  }

  if (pageState === "not-found") {
    return (
      <section className="space-y-6">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Back to list
        </Link>
        <TodoNotFoundState message="This entry doesn't exist or may have been deleted." />
      </section>
    );
  }

  return (
    <article className="space-y-10">
      <Link
        to={backUrl}
        className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back to list
      </Link>

      <header className="space-y-6 pb-8">
        <div className="space-y-4">
          <InlineTextField
            value={formValues.title}
            label="Title"
            placeholder="Untitled entry"
            displayClassName="font-heading text-4xl font-semibold tracking-tight text-text"
            inputClassName="font-heading text-3xl font-semibold"
            onSave={(value) => saveField("title", value)}
          />

          <div className="flex flex-wrap items-center gap-4">
            <InlineSelectField
              value={currentTodo.status}
              label="Status"
              displayValue={getStatusLabel(currentTodo.status)}
              displayClassName={getStatusClassName(currentTodo.status)}
              options={[
                { value: "pending", label: "Active" },
                { value: "completed", label: "Completed" },
              ]}
              onSave={saveStatus}
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
            />

            <InlineDateField
              value={formValues.dueDate}
              label="Due date"
              displayClassName={getDueDateClassName(
                currentTodo.dueDate,
                currentTodo.status
              )}
              onSave={(value) => saveField("dueDate", value)}
            />
          </div>
        </div>

        <div className="border-b border-border" />
      </header>

      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
            Description
          </h2>
          <InlineTextArea
            value={formValues.description}
            label="Description"
            placeholder="Add a description..."
            onSave={(value) => saveField("description", value)}
          />
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
            Tags
          </h2>
          <InlineTagsField
            value={formValues.tags}
            tags={currentTodo.tags}
            onSave={(value) => saveField("tags", value)}
          />
        </div>

        <TodoActivityTimeline
          createdAt={currentTodo.createdAt}
          updatedAt={currentTodo.updatedAt}
        />
      </section>

      {actionLoading ? (
        <p className="text-xs text-text-muted">Saving changes...</p>
      ) : null}
    </article>
  );
}
