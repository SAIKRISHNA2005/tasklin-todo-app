const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function getPriorityLabel(priority) {
  if (!priority) return "Medium";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function getPriorityClassName(priority) {
  switch (priority) {
    case "high":
      return "text-status-overdue";
    case "medium":
      return "text-status-due-soon";
    case "low":
    default:
      return "text-text-muted";
  }
}

export function getDueDateClassName(dueDate, status) {
  if (!dueDate || status === "completed") {
    return "text-text-muted";
  }

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    return "text-status-overdue";
  }

  if (diffHours <= 48) {
    return "text-status-due-soon";
  }

  return "text-text-muted";
}

export function formatDueDate(dueDate) {
  if (!dueDate) return null;

  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getDueDateGroup(todo) {
  if (todo.status === "completed") {
    return "Completed";
  }

  if (!todo.dueDate) {
    return "No Due Date";
  }

  const now = startOfDay(new Date());
  const due = startOfDay(new Date(todo.dueDate));

  if (due < now) {
    return "Overdue";
  }

  if (due.getTime() === now.getTime()) {
    return "Today";
  }

  const weekEnd = endOfWeek(now);
  if (due <= weekEnd) {
    return "This Week";
  }

  return "Later";
}

const GROUP_ORDER = [
  "Overdue",
  "Today",
  "This Week",
  "Later",
  "No Due Date",
  "Completed",
];

export function groupTodosByDueDate(todos) {
  const groups = new Map();

  todos.forEach((todo) => {
    const group = getDueDateGroup(todo);
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group).push(todo);
  });

  return GROUP_ORDER.filter((key) => groups.has(key)).map((key) => ({
    key,
    label: key,
    todos: groups.get(key),
  }));
}

export function collectTags(todos) {
  const tags = new Set();
  todos.forEach((todo) => {
    (todo.tags || []).forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function comparePriority(a, b) {
  return (
    (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
  );
}

export function isTodoOverdue(todo) {
  if (todo.status === "completed" || !todo.dueDate) {
    return false;
  }
  return startOfDay(new Date(todo.dueDate)) < startOfDay(new Date());
}

export function getTodoStatusBadge(todo) {
  if (todo.status === "completed") {
    return { label: "Completed", className: "badge-status-completed" };
  }
  if (isTodoOverdue(todo)) {
    return { label: "Overdue", className: "badge-status-overdue" };
  }
  return { label: "Pending", className: "badge-status-pending" };
}

export function formatTagsLabel(tags) {
  if (!tags?.length) {
    return "General";
  }
  return tags.join(", ");
}

export function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
