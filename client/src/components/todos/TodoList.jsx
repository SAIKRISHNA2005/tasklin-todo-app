import { TodoSectionHeader } from "./TodoSectionHeader.jsx";
import { TodoRow } from "./TodoRow.jsx";
import { groupTodosByDueDate } from "../../utils/todoHelpers.js";

export function TodoList({
  todos,
  selectionMode,
  selectedIds,
  listQueryString,
  onToggleSelect,
  onToggleComplete,
  onDelete,
}) {
  const sections = groupTodosByDueDate(todos);

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.key}>
          <TodoSectionHeader label={section.label} count={section.todos.length} />
          <div className="todo-card-grid mt-3">
            {section.todos.map((todo) => (
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
        </section>
      ))}
    </div>
  );
}
