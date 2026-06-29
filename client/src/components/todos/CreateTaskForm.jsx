import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../../features/todos/todosSlice.js";
import { buildTodoPayload } from "../../lib/validations/todoSchema.js";
import { useToast } from "../../context/ToastContext.jsx";

const priorities = ["low", "medium", "high"];

export function CreateTaskForm() {
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setTags("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      showError("Title is required.");
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        createTodo(
          buildTodoPayload({
            title,
            description,
            dueDate,
            priority,
            tags,
          })
        )
      ).unwrap();
      showSuccess("Task created.");
      resetForm();
    } catch (message) {
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="setup-card-container">
      <form className="setup-card setup-card-form" onSubmit={handleSubmit}>
        <h2>Create Task</h2>
        <div className="form-grid">
          <input
            className="setup-input input-title-field"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Task title"
          />
          <input
            className="setup-input input-desc-field"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Task description"
          />
          <input
            className="setup-input"
            type="date"
            aria-label="Due date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <select
            className="setup-select"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            aria-label="Priority"
          >
            {priorities.map((item) => (
              <option key={item} value={item}>
                {item[0].toUpperCase() + item.slice(1)} priority
              </option>
            ))}
          </select>
          <input
            className="setup-input"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            aria-label="Tags"
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Adding..." : "Add Todo"}
          </button>
        </div>
      </form>
    </div>
  );
}
