import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";

export function TodoPagination({ page, pages, total, limit, onPageChange }) {
  if (pages <= 1) {
    return (
      <div className="pagination-bar">
        <p className="text-xs text-text-faint">
          {total} {total === 1 ? "task" : "tasks"}
        </p>
      </div>
    );
  }

  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);
  const visiblePages = pageNumbers.filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="pagination-bar">
      <p className="text-xs text-text-muted">
        {total} tasks · page {page} of {pages}
      </p>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="pagination-btn"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {visiblePages.map((pageNumber, index) => {
          const prev = visiblePages[index - 1];
          const showEllipsis = prev && pageNumber - prev > 1;

          return (
            <span key={pageNumber} className="flex items-center">
              {showEllipsis ? (
                <span className="px-1 text-xs text-text-faint">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "pagination-btn",
                  pageNumber === page && "pagination-btn-active"
                )}
              >
                {pageNumber}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="pagination-btn"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="hidden text-xs text-text-faint sm:block">{limit} per page</p>
    </div>
  );
}
