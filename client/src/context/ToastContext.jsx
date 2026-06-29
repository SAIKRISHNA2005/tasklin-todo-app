import { createContext, useCallback, useContext, useMemo, useState } from "react";

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
      <div aria-live="polite" className="toast-stack">
        {toasts.map((toast) => {
          const isConfirm = toast.type === "confirm";
          const isDanger = toast.tone === "danger" || toast.type === "error";

          return (
            <div
              key={toast.id}
              className={"toast-card" + (isDanger ? " toast-card-danger" : "")}
            >
              {toast.title ? <p className="toast-title">{toast.title}</p> : null}
              <p className="toast-message">{toast.message}</p>

              {isConfirm ? (
                <div className="toast-actions">
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="btn btn-sm btn-secondary"
                  >
                    {toast.cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={toast.onConfirm}
                    className={"btn btn-sm " + (isDanger ? "btn-danger" : "btn-primary")}
                  >
                    {toast.confirmLabel}
                  </button>
                </div>
              ) : (
                <div className="toast-actions">
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="btn btn-sm btn-secondary"
                  >
                    Dismiss
                  </button>
                </div>
              )}
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
