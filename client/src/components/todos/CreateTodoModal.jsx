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
            <DialogTitle>New task</DialogTitle>
          </DialogHeader>

          <TodoFormFields register={register} errors={errors} />

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              Create
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
