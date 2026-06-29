export function TodoPagination({ page, pages, total, limit, onPageChange }) {
  if (pages <= 1) {
    return (
      <div className="pagination-bar">
        <p>
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
      <p>
        {total} tasks · page {page} of {pages}
      </p>

      <div className="pagination-controls">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="pagination-btn"
          aria-label="Previous page"
        >
          Prev
        </button>

        {visiblePages.map((pageNumber, index) => {
          const prev = visiblePages[index - 1];
          const showEllipsis = prev && pageNumber - prev > 1;

          return (
            <span key={pageNumber} style={{ display: "flex", alignItems: "center" }}>
              {showEllipsis ? (
                <span style={{ paddingInline: "4px", color: "var(--display-onlight-tertiary)" }}>
                  …
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={
                  "pagination-btn" + (pageNumber === page ? " pagination-btn-active" : "")
                }
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
          Next
        </button>
      </div>

      <p>{limit} per page</p>
    </div>
  );
}
