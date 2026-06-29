import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils.js";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "success", message }) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, type, message }]);

      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      showToast: addToast,
      showSuccess: (message) => addToast({ type: "success", message }),
      showError: (message) => addToast({ type: "error", message }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 border border-border bg-surface px-4 py-3 shadow-none",
              toast.type === "success"
                ? "border-l-2 border-l-status-done"
                : "border-l-2 border-l-status-overdue"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-done" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-status-overdue" />
            )}
            <p className="text-sm text-text">{toast.message}</p>
          </div>
        ))}
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
