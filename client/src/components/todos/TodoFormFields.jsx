export function TodoFormFields({ register, errors }) {
  return (
    <div className="space-y-4 font-body">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium text-text">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="What needs doing?"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-none focus:border-accent focus:ring-1 focus:ring-accent"
          {...register("title")}
        />
        {errors.title ? (
          <p className="text-xs text-status-overdue">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-text">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add notes..."
          className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-none focus:border-accent focus:ring-1 focus:ring-accent"
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-xs text-status-overdue">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="dueDate" className="text-sm font-medium text-text">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-none focus:border-accent focus:ring-1 focus:ring-accent"
            {...register("dueDate")}
          />
          {errors.dueDate ? (
            <p className="text-xs text-status-overdue">{errors.dueDate.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="priority" className="text-sm font-medium text-text">
            Priority
          </label>
          <select
            id="priority"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-none focus:border-accent focus:ring-1 focus:ring-accent"
            {...register("priority")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority ? (
            <p className="text-xs text-status-overdue">
              {errors.priority.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="tags" className="text-sm font-medium text-text">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          placeholder="work, urgent, planning"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-none focus:border-accent focus:ring-1 focus:ring-accent"
          {...register("tags")}
        />
        <p className="text-xs text-text-muted">Separate tags with commas.</p>
        {errors.tags ? (
          <p className="text-xs text-status-overdue">{errors.tags.message}</p>
        ) : null}
      </div>
    </div>
  );
}
