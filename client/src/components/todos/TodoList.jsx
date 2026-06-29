import { TodoRow } from "./TodoRow.jsx";

export function TodoList({
  todos,
  selectionMode,
  selectedIds,
  listQueryString,
  onToggleSelect,
  onToggleComplete,
  onDelete,
}) {
  return (
    <div className="card-grid">
      {todos.map((todo) => (
        <TodoRow
          key={todo._id}
          todo={todo}
          selectionMode={selectionMode}
          selected={selectedIds.includes(todo._id)}
          listQueryString={listQueryString}
          onToggleSelect={onToggleSelect}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
