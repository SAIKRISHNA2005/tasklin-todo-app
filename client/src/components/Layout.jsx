import { NavLink, Outlet } from "react-router-dom";
import { ListTodo } from "lucide-react";

const navLinkClassName = ({ isActive }) =>
  [
    "rounded-md px-3.5 py-2 text-sm font-semibold transition-all",
    isActive
      ? "bg-surface-raised text-text shadow-sm"
      : "text-text-muted hover:bg-surface-alt hover:text-text",
  ].join(" ");

export function Layout() {
  return (
    <div className="page-canvas min-h-screen text-text">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="app-shell flex items-center justify-between gap-4 py-3.5">
          <NavLink
            to="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-surface shadow-sm">
              <ListTodo size={17} strokeWidth={2.25} />
            </span>
            <span className="font-heading text-xl font-semibold tracking-normal">
              ZipTrrip
            </span>
          </NavLink>

          <nav className="flex items-center gap-1 font-body">
            <NavLink to="/" end className={navLinkClassName}>
              Tasks
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-shell py-7 sm:py-9">
        <Outlet />
      </main>
    </div>
  );
}
