import { Search } from "lucide-react";

export function TodoSearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        className="input-search"
        aria-label="Search tasks"
      />
    </div>
  );
}
