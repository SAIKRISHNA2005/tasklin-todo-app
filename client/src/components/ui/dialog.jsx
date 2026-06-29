import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn("dialog-overlay fixed inset-0 z-50 bg-black/45 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

export function DialogContent({ className, children, size = "default", ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 border border-border bg-surface p-6 shadow-[0_10px_40px_rgba(28,27,25,0.12)] focus:outline-none",
          size === "default" && "max-w-lg rounded-md",
          size === "sm" && "max-w-md rounded-md",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text"
          aria-label="Close"
        >
          <X size={16} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-6 space-y-1 pr-8", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("font-heading text-2xl font-semibold tracking-tight text-text", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-text-muted", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-8 flex items-center justify-end gap-3", className)}
      {...props}
    />
  );
}
