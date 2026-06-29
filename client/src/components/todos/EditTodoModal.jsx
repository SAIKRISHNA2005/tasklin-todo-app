import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { TodoFormFields } from "./TodoFormFields.jsx";
import {
  buildTodoPayload,
  formatDueDateForInput,
  formatTagsForInput,
  todoFormSchema,
} from "../../lib/validations/todoSchema.js";

export function EditTodoModal({ open, todo, onOpenChange, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      tags: "",
    },
  });

  useEffect(() => {
    if (open && todo) {
      reset({
        title: todo.title || "",
        description: todo.description || "",
        dueDate: formatDueDateForInput(todo.dueDate),
        priority: todo.priority || "medium",
        tags: formatTagsForInput(todo.tags),
      });
    }
  }, [open, todo, reset]);

  const handleFormSubmit = (values) => {
    if (!todo) return;
    onSubmit(todo._id, buildTodoPayload(values, todo.status));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>

          <TodoFormFields register={register} errors={errors} />

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm text-text-muted transition-colors hover:text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !todo}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
