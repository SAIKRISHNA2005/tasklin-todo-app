import { useEffect, useState } from "react";
import { cn } from "../../lib/utils.js";

const inputClassName =
  "w-full rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-sm shadow-sm";

export function InlineTextField({
  value,
  onSave,
  label,
  displayClassName,
  inputClassName: customInputClassName,
  placeholder,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const cancel = () => {
    setDraft(value);
    setError("");
    setEditing(false);
  };

  const save = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(draft);
      setError("");
      setEditing(false);
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-1">
        <input
          type="text"
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className={cn(inputClassName, customInputClassName)}
          aria-label={label}
        />
        {error ? (
          <p className="text-xs text-status-overdue">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "w-full rounded-md text-left transition-colors hover:bg-surface-alt/50",
        displayClassName
      )}
    >
      {value || placeholder}
    </button>
  );
}

export function InlineTextArea({
  value,
  onSave,
  label,
  placeholder,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const cancel = () => {
    setDraft(value);
    setError("");
    setEditing(false);
  };

  const save = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(draft);
      setError("");
      setEditing(false);
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-1">
        <textarea
          autoFocus
          rows={4}
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className={cn(inputClassName, "resize-y")}
          aria-label={label}
        />
        {error ? (
          <p className="text-xs text-status-overdue">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="w-full whitespace-pre-wrap rounded-md text-left text-base leading-relaxed text-text-muted transition-colors hover:bg-surface-alt/50 hover:text-text"
    >
      {value || placeholder}
    </button>
  );
}

export function InlineDateField({ value, onSave, label, displayClassName, pill }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const cancel = () => {
    setDraft(value);
    setError("");
    setEditing(false);
  };

  const save = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(draft);
      setError("");
      setEditing(false);
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-1">
        <input
          type="date"
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          className={inputClassName}
          aria-label={label}
        />
        {error ? (
          <p className="text-xs text-status-overdue">{error}</p>
        ) : null}
      </div>
    );
  }

  const displayLabel = value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Add due date";

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        pill
          ? "tag-chip cursor-pointer text-sm transition-opacity hover:opacity-80"
          : "text-sm transition-colors hover:opacity-80",
        displayClassName
      )}
    >
      {pill ? <span className="text-text-faint">Due · </span> : null}
      {displayLabel}
    </button>
  );
}

export function InlineSelectField({
  value,
  onSave,
  label,
  options,
  displayValue,
  displayClassName,
  pill,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const save = async (nextValue) => {
    if (nextValue === value) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(nextValue);
      setError("");
      setEditing(false);
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-1">
        <select
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDraft(nextValue);
            save(nextValue);
          }}
          onBlur={() => setEditing(false)}
          className={inputClassName}
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-status-overdue">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        pill
          ? "tag-chip cursor-pointer text-sm font-medium transition-opacity hover:opacity-80"
          : "inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80",
        displayClassName
      )}
    >
      {!pill ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {pill ? <span className="text-text-faint">{label} · </span> : null}
      {displayValue}
    </button>
  );
}

export function InlineTagsField({ value, onSave, tags }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const cancel = () => {
    setDraft(value);
    setError("");
    setEditing(false);
  };

  const save = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(draft);
      setError("");
      setEditing(false);
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          placeholder="work, planning, urgent"
          className={inputClassName}
          aria-label="Tags"
        />
        <p className="text-xs text-text-muted">Separate tags with commas.</p>
        {error ? (
          <p className="text-xs text-status-overdue">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="w-full text-left"
    >
      {tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-text-muted">Add tags</span>
      )}
    </button>
  );
}
