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
          <DialogTitle>Delete Entry</DialogTitle>
          <DialogDescription>
            {todo
              ? `Are you sure you want to delete "${todo.title}"? This action cannot be undone.`
              : "Are you sure you want to delete this entry? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !todo}
            onClick={() => todo && onConfirm(todo._id)}
            className="rounded-md bg-status-overdue px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
