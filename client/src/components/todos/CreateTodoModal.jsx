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
  todoFormSchema,
} from "../../lib/validations/todoSchema.js";

const defaultValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  tags: "",
};

export function CreateTodoModal({ open, onOpenChange, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleFormSubmit = (values) => {
    onSubmit(buildTodoPayload(values));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>New Entry</DialogTitle>
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
              disabled={submitting}
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
