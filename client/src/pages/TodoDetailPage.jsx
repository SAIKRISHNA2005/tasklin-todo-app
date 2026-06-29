import { Link, useParams } from "react-router-dom";

export function TodoDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Todo Detail
        </h1>
        <p className="text-sm text-text-muted">Placeholder for id: {id}</p>
      </header>

      <div className="rounded-md border border-border bg-surface p-5">
        <div className="text-sm font-medium">Navigation check</div>
        <p className="mt-1 text-sm text-text-muted">
          Use the back link to confirm the route switches to <code>/</code>.
        </p>
        <div className="mt-4">
          <Link className="text-sm font-medium text-accent hover:opacity-90" to="/">
            Back to Todo List
          </Link>
        </div>
      </div>
    </section>
  );
}

