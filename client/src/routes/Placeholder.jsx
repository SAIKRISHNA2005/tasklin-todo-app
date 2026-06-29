import { NotebookPen } from "lucide-react";

export function Placeholder() {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-2 text-text-muted">
          <NotebookPen size={18} />
          <span className="text-sm">ZipTrripProject</span>
        </div>

        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">
          Foundation ready
        </h1>
        <p className="mt-3 max-w-prose text-base text-text-muted">
          Router + Redux are wired. Theme tokens + fonts are applied. No todo
          features yet.
        </p>

        <div className="mt-8 rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Paper & ink theme</div>
              <div className="mt-1 text-sm text-text-muted">
                Hairline borders, no heavy shadows, calm accent.
              </div>
            </div>
            <div className="h-9 w-9 rounded-md bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

