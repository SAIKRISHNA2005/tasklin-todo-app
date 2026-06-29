import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../hooks/useDebounce.js";
import { useToast } from "../context/ToastContext.jsx";
import {
  bulkCompleteTodos,
  bulkDeleteTodos,
  clearError,
  createTodo,
  deleteTodo,
  fetchTodos,
  setFilters,
  setPage,
  setSearch,
  setSort,
  toggleTodoComplete,
  updateTodo,
} from "../features/todos/todosSlice.js";
import { collectTags } from "../utils/todoHelpers.js";
import { TodoSearchBar } from "../components/todos/TodoSearchBar.jsx";
import { TodoFilterBar } from "../components/todos/TodoFilterBar.jsx";
import { TodoList } from "../components/todos/TodoList.jsx";
import { TodoRowSkeleton } from "../components/todos/TodoRowSkeleton.jsx";
import { TodoEmptyState } from "../components/todos/TodoEmptyState.jsx";
import { TodoPagination } from "../components/todos/TodoPagination.jsx";
import { BulkActionBar } from "../components/todos/BulkActionBar.jsx";
import { CreateTodoModal } from "../components/todos/CreateTodoModal.jsx";
import { EditTodoModal } from "../components/todos/EditTodoModal.jsx";
import { DeleteConfirmModal } from "../components/todos/DeleteConfirmModal.jsx";

export function TodoListPage() {
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const { todos, listLoading, actionLoading, pagination, filters, error } =
    useSelector((state) => state.todos);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  const availableTags = useMemo(() => collectTags(todos), [todos]);

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
        showSuccess("Entry updated.");
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
      showSuccess(`${selectedIds.length} entries marked complete.`);
    } catch (message) {
      showError(message);
    }
  }, [dispatch, selectedIds, showSuccess, showError]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return;

    const count = selectedIds.length;

    try {
      await dispatch(bulkDeleteTodos(selectedIds)).unwrap();
      setSelectedIds([]);
      showSuccess(`${count} entries deleted.`);
    } catch (message) {
      showError(message);
    }
  }, [dispatch, selectedIds, showSuccess, showError]);

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

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(createTodo(payload)).unwrap();
        await dispatch(fetchTodos()).unwrap();
        setCreateOpen(false);
        showSuccess("Entry created.");
      } catch (message) {
        showError(message);
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleUpdate = useCallback(
    async (id, payload) => {
      try {
        await dispatch(updateTodo({ id, todo: payload })).unwrap();
        await dispatch(fetchTodos()).unwrap();
        setEditingTodo(null);
        showSuccess("Entry updated.");
      } catch (message) {
        showError(message);
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteTodo(id)).unwrap();
        setSelectedIds((current) => current.filter((item) => item !== id));
        setDeletingTodo(null);
        showSuccess("Entry deleted.");
      } catch (message) {
        showError(message);
      }
    },
    [dispatch, showSuccess, showError]
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Todo List
          </h1>
          <p className="text-sm text-text-muted">
            A ledger of entries, grouped by due date.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          New Todo
        </button>
      </header>

      <div className="space-y-5">
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

        <BulkActionBar
          selectedCount={selectedIds.length}
          actionLoading={actionLoading}
          onSelectAll={selectAllOnPage}
          onClearSelection={clearSelection}
          onBulkComplete={handleBulkComplete}
          onBulkDelete={handleBulkDelete}
        />

        {listLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <TodoRowSkeleton key={index} />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <TodoEmptyState />
        ) : (
          <TodoList
            todos={todos}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelected}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingTodo}
            onDelete={setDeletingTodo}
          />
        )}

        <TodoPagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(page) => dispatch(setPage(page))}
        />
      </div>

      <CreateTodoModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        submitting={actionLoading}
      />

      <EditTodoModal
        open={Boolean(editingTodo)}
        todo={editingTodo}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTodo(null);
          }
        }}
        onSubmit={handleUpdate}
        submitting={actionLoading}
      />

      <DeleteConfirmModal
        open={Boolean(deletingTodo)}
        todo={deletingTodo}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTodo(null);
          }
        }}
        onConfirm={handleDelete}
        submitting={actionLoading}
      />
    </section>
  );
}
