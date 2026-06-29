import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext.jsx";
import { TodoFormFields } from "../components/todos/TodoFormFields.jsx";
import { TodoNotFoundState } from "../components/todos/TodoNotFoundState.jsx";
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
  });

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

  if (pageState === "loading") {
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

  return (
    <div className="setup-container setup-container-narrow">
      <div className="details-header-bar">
        <h1>{isEdit ? "Edit Task" : "Create Task"}</h1>
        <Link to={backUrl} className="btn btn-secondary">
          Back to Todo List
        </Link>
      </div>

      <form className="setup-card setup-card-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>{isEdit ? "Update task details" : "New task details"}</h2>

        <TodoFormFields register={register} errors={errors} />

        <div className="accessory-view" style={{ borderBlockStart: "none", marginBlockStart: 0, paddingBlockStart: 0 }}>
          <Link to={backUrl} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={actionLoading} className="btn btn-primary">
            {actionLoading ? "Saving..." : isEdit ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
