import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDot, Save, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";
import { TodoFormFields } from "../components/todos/TodoFormFields.jsx";
import { TodoNotFoundState } from "../components/todos/TodoNotFoundState.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";
import {
  clearCurrentTodo,
  createTodo,
  fetchTodoById,
  updateTodo,
} from "../features/todos/todosSlice.js";
import {
  buildTodoPayload,
  formatDueDateForInput,
  formatTagsForInput,
  todoFormSchema,
} from "../lib/validations/todoSchema.js";
import { buildListUrl, isValidObjectId } from "../utils/listQueryParams.js";

const defaultValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  tags: "",
};

function getInitials(title) {
  return (title || "New task")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function formatPriorityLabel(priority) {
  if (!priority) return "Priority unset";
  return priority[0].toUpperCase() + priority.slice(1) + " priority";
}

export function TodoFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const { currentTodo, actionLoading } = useSelector((state) => state.todos);
  const [pageState, setPageState] = useState(isEdit ? "loading" : "ready");

  const backUrl = useMemo(() => buildListUrl(searchParams), [searchParams]);
  const querySuffix = searchParams.toString() ? "?" + searchParams.toString() : "";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
  });

  const watchedTitle = watch("title");
  const watchedPriority = watch("priority");
  const watchedDueDate = watch("dueDate");

  useEffect(() => {
    if (!isEdit) {
      setPageState("ready");
      reset(defaultValues);
      dispatch(clearCurrentTodo());
      return;
    }

    if (!id || !isValidObjectId(id)) {
      setPageState("not-found");
      return;
    }

    setPageState("loading");
    dispatch(clearCurrentTodo());

    dispatch(fetchTodoById(id))
      .unwrap()
      .then((todo) => {
        reset({
          title: todo.title || "",
          description: todo.description || "",
          dueDate: formatDueDateForInput(todo.dueDate),
          priority: todo.priority || "medium",
          tags: formatTagsForInput(todo.tags),
        });
        setPageState("ready");
      })
      .catch(() => setPageState("not-found"));

    return () => {
      dispatch(clearCurrentTodo());
    };
  }, [dispatch, id, isEdit, reset]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        if (isEdit) {
          if (!currentTodo) return;
          const payload = buildTodoPayload(values, currentTodo.status);
          const updated = await dispatch(
            updateTodo({ id: currentTodo._id, todo: payload })
          ).unwrap();
          showSuccess("Task changes saved.");
          navigate("/todos/" + updated._id + querySuffix);
          return;
        }

        const created = await dispatch(createTodo(buildTodoPayload(values))).unwrap();
        showSuccess("Task created.");
        navigate("/todos/" + created._id + querySuffix);
      } catch (message) {
        showError(message);
      }
    },
    [currentTodo, dispatch, isEdit, navigate, querySuffix, showError, showSuccess]
  );

  const backLink = (
    <Link to={backUrl} className="btn-ghost -ml-2 gap-1.5 !px-2">
      <ArrowLeft size={15} />
      Back to tasks
    </Link>
  );

  if (pageState === "loading") {
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
    <section className="space-y-6">
      {backLink}

      <div className="form-page-grid">
        <aside className="form-brief">
          <div className="form-avatar" aria-hidden="true">
            {getInitials(watchedTitle)}
          </div>
          <div className="space-y-2">
            <p className="section-label">{isEdit ? "Edit task" : "Create task"}</p>
            <h1 className="font-heading text-3xl font-semibold leading-tight text-text sm:text-4xl">
              {isEdit ? "Make the task clearer" : "Plan the next thing"}
            </h1>
            <p className="text-sm leading-6 text-text-muted">
              Keep it direct, add the deadline if it matters, and tag it so the list stays easy to scan later.
            </p>
          </div>

          <div className="form-brief-list">
            <div className="form-brief-item">
              <CircleDot size={16} />
              <span>{formatPriorityLabel(watchedPriority)}</span>
            </div>
            <div className="form-brief-item">
              <CalendarClock size={16} />
              <span>{watchedDueDate || "No due date yet"}</span>
            </div>
            <div className="form-brief-item">
              {isDirty ? <Sparkles size={16} /> : <CheckCircle2 size={16} />}
              <span>{isDirty ? "Unsaved edits" : "Ready"}</span>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit(onSubmit)} className="form-panel">
          <div className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-label">Task details</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-text">
                {isEdit ? "Update task" : "New task"}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link to={backUrl} className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" disabled={actionLoading} className="btn-primary">
                <Save size={16} />
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </div>

          <TodoFormFields register={register} errors={errors} variant="page" />
        </form>
      </div>
    </section>
  );
}
