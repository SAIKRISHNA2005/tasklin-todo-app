import { cn } from "../../lib/utils.js";

export function TodoPagination({ page, pages, total, limit, onPageChange }) {
  if (pages <= 1) {
    return (
      <div className="border-t border-border pt-4 text-sm text-text-muted">
        {total} {total === 1 ? "entry" : "entries"}
      </div>
    );
  }

  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <p className="text-sm text-text-muted">
        Page {page} of {pages} · {total} entries
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text disabled:opacity-40"
        >
          Previous
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "min-w-8 px-2 py-1.5 text-sm transition-colors",
              pageNumber === page
                ? "font-medium text-accent"
                : "text-text-muted hover:text-text"
            )}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <p className="text-xs text-text-muted">{limit} per page</p>
    </div>
  );
}
