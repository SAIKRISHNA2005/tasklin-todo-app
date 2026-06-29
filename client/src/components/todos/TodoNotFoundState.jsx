import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

export function TodoNotFoundState({ message }) {
  return (
    <div className="bento-tile flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-raised text-text-faint shadow-sm">
        <FileQuestion size={26} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-semibold text-text">
        Task not found
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{message}</p>
      <Link to="/" className="btn-secondary mt-7">
        Go to tasks
      </Link>
    </div>
  );
}
