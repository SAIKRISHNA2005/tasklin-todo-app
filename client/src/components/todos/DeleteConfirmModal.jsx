import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";

export function DeleteConfirmModal({
  open,
  todo,
  onOpenChange,
  onConfirm,
  submitting,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete task?</DialogTitle>
          <DialogDescription>
            {todo
              ? `"${todo.title}" will be permanently removed.`
              : "This task will be permanently removed."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button type="button" onClick={() => onOpenChange(false)} className="btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !todo}
            onClick={() => todo && onConfirm(todo._id)}
            className="btn-primary !bg-status-overdue hover:!opacity-90"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
