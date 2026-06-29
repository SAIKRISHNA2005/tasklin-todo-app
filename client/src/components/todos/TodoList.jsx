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
  onEdit,
  onDelete,
}) {
  const sections = groupTodosByDueDate(todos);

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <section key={section.key}>
          <TodoSectionHeader label={section.label} />
          <div className="mt-3 space-y-2">
            {section.todos.map((todo) => (
              <TodoRow
                key={todo._id}
                todo={todo}
                selectionMode={selectionMode}
                selected={selectedIds.includes(todo._id)}
                listQueryString={listQueryString}
                onToggleSelect={onToggleSelect}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
