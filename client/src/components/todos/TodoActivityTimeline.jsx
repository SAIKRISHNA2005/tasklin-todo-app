function formatTimestamp(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TodoActivityTimeline({ createdAt, updatedAt }) {
  const events = [{ id: "created", label: "Created", date: createdAt }];

  if (updatedAt && createdAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime()) {
    events.push({
      id: "updated",
      label: "Last updated",
      date: updatedAt,
    });
  }

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
        Activity
      </h2>
      <div className="border-t border-border pt-4">
        <ol className="space-y-5">
          {events.map((event, index) => (
            <li key={event.id} className="relative flex gap-4 pl-5">
              {index < events.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-1.25rem] left-[0.27rem] top-3 w-px bg-border"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-2 w-2 rounded-full border border-border bg-surface"
              />
              <div className="space-y-0.5">
                <p className="text-sm text-text-muted">{event.label}</p>
                <time
                  dateTime={event.date}
                  className="text-xs text-text-muted"
                >
                  {formatTimestamp(event.date)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
