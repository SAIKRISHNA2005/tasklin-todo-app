export function TodoFormFields({ register, errors }) {
  return (
    <div className="form-grid form-grid-page">
      <div>
        <label htmlFor="title" className="form-field-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          className={"setup-input" + (errors.title ? " setup-input-error" : "")}
          {...register("title")}
        />
        {errors.title ? (
          <p className="field-error">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="form-field-label">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Description"
          className="setup-textarea"
          {...register("description")}
        />
        {errors.description ? (
          <p className="field-error">{errors.description.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="dueDate" className="form-field-label">
          Due date
        </label>
        <input
          id="dueDate"
          type="date"
          className="setup-input"
          {...register("dueDate")}
        />
        {errors.dueDate ? (
          <p className="field-error">{errors.dueDate.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="priority" className="form-field-label">
          Priority
        </label>
        <select id="priority" className="setup-select" {...register("priority")}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        {errors.priority ? (
          <p className="field-error">{errors.priority.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="tags" className="form-field-label">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          placeholder="work, urgent, planning"
          className="setup-input"
          {...register("tags")}
        />
        <p className="field-hint">Separate tags with commas.</p>
        {errors.tags ? (
          <p className="field-error">{errors.tags.message}</p>
        ) : null}
      </div>
    </div>
  );
}
