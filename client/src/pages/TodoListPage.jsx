import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../hooks/useDebounce.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  bulkCompleteTodos,
  bulkDeleteTodos,
  clearError,
  deleteTodo,
  fetchTodos,
  hydrateFilters,
  setFilters,
  setPage,
  setSearch,
  setSort,
  toggleTodoComplete,
} from "../features/todos/todosSlice.js";
import { collectTags } from "../utils/todoHelpers.js";
import {
  appendListQuery,
  filtersToSearchParams,
  searchParamsToFilters,
} from "../utils/listQueryParams.js";
import { TodoSearchBar } from "../components/todos/TodoSearchBar.jsx";
import { TodoFilterBar } from "../components/todos/TodoFilterBar.jsx";
import { TodoList } from "../components/todos/TodoList.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";
import { TodoEmptyState } from "../components/todos/TodoEmptyState.jsx";
import { TodoPagination } from "../components/todos/TodoPagination.jsx";
import { BulkActionBar } from "../components/todos/BulkActionBar.jsx";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function TodoListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const { todos, listLoading, actionLoading, pagination, filters, error } =
    useSelector((state) => state.todos);

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedSearch = useDebounce(searchInput, 300);

  const availableTags = useMemo(() => collectTags(todos), [todos]);
  const listQueryString = searchParams.toString();
  const createUrl = appendListQuery("/todos/new", new URLSearchParams(listQueryString));

  const pageStats = useMemo(() => {
    const active = todos.filter((todo) => todo.status !== "completed").length;
    const done = todos.filter((todo) => todo.status === "completed").length;
    const overdue = todos.filter((todo) => {
      if (todo.status === "completed" || !todo.dueDate) return false;
      return new Date(todo.dueDate) < new Date();
    }).length;
    return { active, done, overdue };
  }, [todos]);

  useEffect(() => {
    const urlFilters = searchParamsToFilters(searchParams);
    dispatch(hydrateFilters(urlFilters));
    setSearchInput(urlFilters.search || "");
  }, [searchParams, dispatch]);

  useEffect(() => {
    const nextParams = filtersToSearchParams(filters);
    const current = searchParams.toString();
    const next = nextParams.toString();

    if (current !== next) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setSearch(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, filters.search]);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [
    dispatch,
    filters.status,
    filters.priority,
    filters.tag,
    filters.search,
    filters.sort,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, showError, dispatch]);

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => todos.some((todo) => todo._id === id))
    );
  }, [todos]);

  const handleToggleComplete = useCallback(
    async (id) => {
      try {
        await dispatch(toggleTodoComplete(id)).unwrap();
        showSuccess("Task updated.");
      } catch (message) {
        showError(message);
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleBulkComplete = useCallback(async () => {
    if (!selectedIds.length) return;

    try {
      await dispatch(bulkCompleteTodos(selectedIds)).unwrap();
      setSelectedIds([]);
      showSuccess(String(selectedIds.length) + " tasks marked complete.");
    } catch (message) {
      showError(message);
    }
  }, [dispatch, selectedIds, showSuccess, showError]);

  const confirmBulkDelete = useCallback(() => {
    if (!selectedIds.length) return;
    const ids = [...selectedIds];
    const count = ids.length;

    showConfirm({
      title: count === 1 ? "Delete selected task?" : "Delete " + count + " tasks?",
      message:
        count === 1
          ? "This task will be permanently removed from your list."
          : "These tasks will be permanently removed from your list.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: async () => {
        try {
          await dispatch(bulkDeleteTodos(ids)).unwrap();
          setSelectedIds([]);
          showSuccess(count === 1 ? "Task deleted." : String(count) + " tasks deleted.");
        } catch (message) {
          showError(message);
        }
      },
    });
  }, [dispatch, selectedIds, showConfirm, showError, showSuccess]);

  const confirmDelete = useCallback(
    (todo) => {
      showConfirm({
        title: "Delete task?",
        message: "\"" + todo.title + "\" will be permanently removed.",
        confirmLabel: "Delete",
        tone: "danger",
        onConfirm: async () => {
          try {
            await dispatch(deleteTodo(todo._id)).unwrap();
            setSelectedIds((current) => current.filter((item) => item !== todo._id));
            showSuccess("Task deleted.");
          } catch (message) {
            showError(message);
          }
        },
      });
    },
    [dispatch, showConfirm, showError, showSuccess]
  );

  const toggleSelected = useCallback((id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }, []);

  const selectAllOnPage = useCallback(() => {
    setSelectedIds(todos.map((todo) => todo._id));
  }, [todos]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((current) => {
      if (current) {
        setSelectedIds([]);
      }
      return !current;
    });
  }, []);

  return (
    <section className="bento-dashboard">
      <header className="bento-hero-tile dashboard-hero">
        <p className="text-sm font-medium text-text-muted">{getGreeting()}</p>
        <h1 className="mt-1 font-heading text-[2rem] font-semibold leading-tight text-text sm:text-[2.5rem]">
          Your tasks
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-muted">
          A focused queue for what needs doing, what can wait, and what is already handled.
        </p>
      </header>

      <div className="bento-action-tile bento-tile p-5 sm:p-6">
        <div className="flex items-center gap-2 text-text-muted">
          <CalendarDays size={15} strokeWidth={2} />
          <span className="text-sm font-medium">{formatToday()}</span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-text-muted">
            {pagination.total > 0
              ? pagination.total + " tasks in your workspace"
              : "Nothing queued yet"}
          </p>
          <Link to={createUrl} className="btn-primary w-full sm:w-auto">
            <Plus size={16} strokeWidth={2.5} />
            New task
          </Link>
        </div>
      </div>

      {!listLoading && todos.length > 0 ? (
        <div className="bento-stats-row">
          <div className="stat-card">
            <span className="stat-card-label">Total</span>
            <span className="stat-card-value">{pagination.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Active</span>
            <span className="stat-card-value">{pageStats.active}</span>
          </div>
          <div className="stat-card stat-card-overdue">
            <span className="stat-card-label">Overdue</span>
            <span className="stat-card-value">{pageStats.overdue}</span>
          </div>
          <div className="stat-card stat-card-done">
            <span className="stat-card-label">Done</span>
            <span className="stat-card-value">{pageStats.done}</span>
          </div>
        </div>
      ) : null}

      <div className="bento-controls-tile bento-tile p-4 sm:p-5">
        <div className="space-y-4">
          <TodoSearchBar value={searchInput} onChange={setSearchInput} />
          <TodoFilterBar
            status={filters.status}
            priority={filters.priority}
            tag={filters.tag}
            sort={filters.sort}
            availableTags={availableTags}
            onStatusChange={(value) => dispatch(setFilters({ status: value }))}
            onPriorityChange={(value) => dispatch(setFilters({ priority: value }))}
            onTagChange={(value) => dispatch(setFilters({ tag: value }))}
            onSortChange={(value) => dispatch(setSort(value))}
            selectionMode={selectionMode}
            onToggleSelectionMode={toggleSelectionMode}
          />
        </div>

        {selectedIds.length > 0 ? (
          <div className="mt-4">
            <BulkActionBar
              selectedCount={selectedIds.length}
              actionLoading={actionLoading}
              onSelectAll={selectAllOnPage}
              onClearSelection={clearSelection}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={confirmBulkDelete}
            />
          </div>
        ) : null}
      </div>

      <div className="bento-content-tile bento-tile">
        <div className="p-4 sm:p-5">
          {listLoading ? (
            <div className="todo-card-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <TodoRowSkeleton key={index} />
              ))}
            </div>
          ) : todos.length === 0 ? (
            <TodoEmptyState onCreateClick={() => navigate(createUrl)} />
          ) : (
            <TodoList
              todos={todos}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              listQueryString={listQueryString}
              onToggleSelect={toggleSelected}
              onToggleComplete={handleToggleComplete}
              onDelete={confirmDelete}
            />
          )}
        </div>

        <TodoPagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => dispatch(setPage(page))}
        />
      </div>
    </section>
  );
}
