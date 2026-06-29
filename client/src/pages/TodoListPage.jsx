import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { collectTags, isTodoOverdue, startOfDay } from "../utils/todoHelpers.js";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "../utils/listQueryParams.js";
import { CreateTaskForm } from "../components/todos/CreateTaskForm.jsx";
import { TodoFilterBar } from "../components/todos/TodoFilterBar.jsx";
import { TodoList } from "../components/todos/TodoList.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";
import { TodoEmptyState } from "../components/todos/TodoEmptyState.jsx";
import { TodoPagination } from "../components/todos/TodoPagination.jsx";
import { BulkActionBar } from "../components/todos/BulkActionBar.jsx";

function isDueToday(todo) {
  if (!todo.dueDate) return false;
  const due = startOfDay(new Date(todo.dueDate));
  const today = startOfDay(new Date());
  return due.getTime() === today.getTime();
}

export function TodoListPage() {
  const dispatch = useDispatch();
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

  const stats = useMemo(() => {
    return {
      total: pagination.total,
      pending: todos.filter((todo) => todo.status !== "completed").length,
      dueToday: todos.filter(isDueToday).length,
      overdue: todos.filter(isTodoOverdue).length,
    };
  }, [pagination.total, todos]);

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
    <div className="setup-container">
      <div className="setup-header">
        <h1>Todo Application</h1>
        <p>
          Organize tasks with due dates, priorities, tags, and status tracking.
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-item">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="stat-item">
          <span>Today</span>
          <strong>{stats.dueToday}</strong>
        </div>
        <div className="stat-item stat-item-overdue">
          <span>Overdue</span>
          <strong>{stats.overdue}</strong>
        </div>
      </div>

      <CreateTaskForm />

      <TodoFilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
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

      <BulkActionBar
        selectedCount={selectedIds.length}
        actionLoading={actionLoading}
        onSelectAll={selectAllOnPage}
        onClearSelection={clearSelection}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={confirmBulkDelete}
      />

      {listLoading ? (
        <div className="card-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <TodoRowSkeleton key={index} />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <TodoEmptyState />
      ) : (
        <>
          <TodoList
            todos={todos}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            listQueryString={listQueryString}
            onToggleSelect={toggleSelected}
            onToggleComplete={handleToggleComplete}
            onDelete={confirmDelete}
          />

          <TodoPagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(page) => dispatch(setPage(page))}
          />
        </>
      )}
    </div>
  );
}
