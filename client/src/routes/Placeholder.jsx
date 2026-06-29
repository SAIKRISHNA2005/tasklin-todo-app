import { NotebookPen } from "lucide-react";

export function Placeholder() {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-2 text-text-muted">
          <NotebookPen size={18} />
          <span className="text-sm font-semibold">ZipTrripProject</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-normal">
          Dashboard ready
        </h1>
        <p className="mt-3 max-w-prose text-base text-text-muted">
          Router, Redux, and the task-dashboard design system are wired.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold">Clean productivity theme</div>
              <div className="mt-1 text-sm text-text-muted">
                White cards, slate controls, compact spacing, and calm status colors.
              </div>
            </div>
            <div className="h-9 w-9 rounded-lg bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

