export function TodoEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <svg
        width="120"
        height="72"
        viewBox="0 0 120 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mb-5 text-text-muted"
      >
        <rect
          x="8"
          y="10"
          width="104"
          height="52"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="26"
          x2="88"
          y2="26"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="38"
          x2="72"
          y2="38"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="24"
          y1="50"
          x2="56"
          y2="50"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <p className="text-sm text-text-muted">
        No entries match your filters.
      </p>
    </div>
  );
}
