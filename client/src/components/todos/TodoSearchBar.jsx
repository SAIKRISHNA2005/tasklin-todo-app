export function TodoSearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="setup-input search-field"
      placeholder="Search title, description, tags..."
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Search tasks"
    />
  );
}
