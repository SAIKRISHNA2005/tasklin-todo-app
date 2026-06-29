import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTodos } from "../features/todos/todosSlice.js";

export function TodoListPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos())
      .unwrap()
      .then((data) => {
        console.log("[todos] fetched seeded data:", data.todos);
      })
      .catch((error) => {
        console.error("[todos] fetch failed:", error);
      });
  }, [dispatch]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Todo List
        </h1>
        <p className="text-sm text-text-muted">
          Placeholder page — list UI comes later.
        </p>
      </header>

      <div className="rounded-md border border-border bg-surface p-5">
        <div className="text-sm font-medium">Navigation check</div>
        <p className="mt-1 text-sm text-text-muted">
          Try opening a detail route to confirm URL changes.
        </p>
        <div className="mt-4">
          <Link
            className="text-sm font-medium text-accent hover:opacity-90"
            to="/todos/1"
          >
            Go to Todo Detail (id: 1)
          </Link>
        </div>
      </div>
    </section>
  );
}

