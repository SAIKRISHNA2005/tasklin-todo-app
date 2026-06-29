import { Search } from "lucide-react";

export function TodoSearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search entries..."
        className="w-full border-0 border-b border-border bg-transparent py-2 pl-6 pr-2 text-sm shadow-none focus:border-accent focus:ring-0"
        aria-label="Search todos"
      />
    </div>
  );
}
