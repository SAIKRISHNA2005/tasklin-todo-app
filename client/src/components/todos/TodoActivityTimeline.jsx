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
      label: "Last edited",
      date: updatedAt,
    });
  }

  return (
    <section className="space-y-4">
      <h2 className="section-label">Activity</h2>
      <ol className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-baseline justify-between gap-4 rounded-md border border-border bg-surface px-3 py-2.5 text-sm"
          >
            <span className="font-medium text-text-muted">{event.label}</span>
            <time dateTime={event.date} className="text-xs tabular-nums text-text-faint">
              {formatTimestamp(event.date)}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}
