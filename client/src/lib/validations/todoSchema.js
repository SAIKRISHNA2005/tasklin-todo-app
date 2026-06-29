import { z } from "zod";

export const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Due date must be a valid date"
    ),
  priority: z.enum(["low", "medium", "high"], {
    error: "Priority is required",
  }),
  tags: z.string().optional(),
});

export function parseTagsInput(value) {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags) {
  return (tags || []).join(", ");
}

export function formatDueDateForInput(dueDate) {
  if (!dueDate) {
    return "";
  }

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export function buildTodoPayload(values, status = "pending") {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    status,
    priority: values.priority,
    dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
    tags: parseTagsInput(values.tags),
  };
}
