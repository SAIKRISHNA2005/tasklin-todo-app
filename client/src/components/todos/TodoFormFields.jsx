import { cn } from "../../lib/utils.js";

export function TodoFormFields({ register, errors, variant = "compact" }) {
  const isPage = variant === "page";
  const fieldClass = isPage ? "form-field" : "space-y-1.5";
  const inputClass = isPage ? "form-input" : "w-full shadow-sm";

  return (
    <div className={cn("font-body", isPage ? "space-y-5 pt-5" : "space-y-4")}>
      <div className={fieldClass}>
        <label htmlFor="title" className="text-sm font-semibold text-text">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="What needs doing?"
          className={inputClass}
          {...register("title")}
        />
        {errors.title ? (
          <p className="text-xs font-medium text-status-overdue">{errors.title.message}</p>
        ) : null}
      </div>

      <div className={fieldClass}>
        <label htmlFor="description" className="text-sm font-semibold text-text">
          Description
        </label>
        <textarea
          id="description"
          rows={isPage ? 6 : 3}
          placeholder="Add notes, context, or acceptance details."
          className={cn(inputClass, "resize-y")}
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs font-medium text-status-overdue">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={fieldClass}>
          <label htmlFor="dueDate" className="text-sm font-semibold text-text">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            className={inputClass}
            {...register("dueDate")}
          />
          {errors.dueDate ? (
            <p className="text-xs font-medium text-status-overdue">{errors.dueDate.message}</p>
          ) : null}
        </div>

        <div className={fieldClass}>
          <label htmlFor="priority" className="text-sm font-semibold text-text">
            Priority
          </label>
          <select id="priority" className={inputClass} {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority ? (
            <p className="text-xs font-medium text-status-overdue">
              {errors.priority.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="tags" className="text-sm font-semibold text-text">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          placeholder="work, urgent, planning"
          className={inputClass}
          {...register("tags")}
        />
        <p className="text-xs text-text-muted">Separate tags with commas.</p>
        {errors.tags ? (
          <p className="text-xs font-medium text-status-overdue">{errors.tags.message}</p>
        ) : null}
      </div>
    </div>
  );
}
