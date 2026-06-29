import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { cn } from "../lib/utils.js";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "success", title, message, duration = 3600 }) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, type, title, message }]);

      if (duration) {
        setTimeout(() => dismissToast(id), duration);
      }
      return id;
    },
    [dismissToast]
  );

  const showConfirm = useCallback(
    ({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "default", onConfirm }) => {
      const id = ++toastId;
      const confirm = async () => {
        try {
          await onConfirm?.();
        } finally {
          dismissToast(id);
        }
      };

      setToasts((current) => [
        ...current,
        {
          id,
          type: "confirm",
          title,
          message,
          confirmLabel,
          cancelLabel,
          tone,
          onConfirm: confirm,
        },
      ]);
      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      showToast: addToast,
      showSuccess: (message, title) => addToast({ type: "success", title, message }),
      showError: (message, title) => addToast({ type: "error", title, message }),
      showInfo: (message, title) => addToast({ type: "info", title, message }),
      showConfirm,
    }),
    [addToast, showConfirm]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-5 sm:right-5"
      >
        {toasts.map((toast) => {
          const isConfirm = toast.type === "confirm";
          const isDanger = toast.tone === "danger" || toast.type === "error";
          const Icon = isConfirm ? AlertTriangle : toast.type === "success" ? Check : toast.type === "info" ? Info : X;

          return (
            <div
              key={toast.id}
              className={cn(
                "toast-enter pointer-events-auto rounded-lg border bg-surface-raised p-4 shadow-lg",
                isDanger ? "border-status-overdue/25" : "border-border"
              )}
            >
              <div className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isDanger
                      ? "bg-[color-mix(in_srgb,var(--status-overdue)_12%,transparent)] text-status-overdue"
                      : "bg-[color-mix(in_srgb,var(--status-done)_12%,transparent)] text-status-done"
                  )}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  {toast.title ? (
                    <p className="text-sm font-semibold text-text">{toast.title}</p>
                  ) : null}
                  <p className="text-sm leading-5 text-text-muted">{toast.message}</p>

                  {isConfirm ? (
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => dismissToast(toast.id)}
                        className="btn-ghost !px-2.5 !py-1.5"
                      >
                        {toast.cancelLabel}
                      </button>
                      <button
                        type="button"
                        onClick={toast.onConfirm}
                        className={cn(
                          "btn-primary !px-3 !py-1.5",
                          isDanger && "!bg-status-overdue"
                        )}
                      >
                        {toast.confirmLabel}
                      </button>
                    </div>
                  ) : null}
                </div>
                {!isConfirm ? (
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="btn-ghost -mr-2 -mt-2 !p-1.5"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
