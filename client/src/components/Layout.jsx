import { NavLink, Outlet } from "react-router-dom";

const navLinkClassName = ({ isActive }) =>
  [
    "text-sm font-medium tracking-wide transition-colors",
    isActive ? "text-accent" : "text-text-muted hover:text-text",
  ].join(" ");

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6 px-6 py-5">
          <div className="font-heading text-2xl font-semibold tracking-tight">
            ZipTrrip
          </div>
          <nav className="flex items-center gap-5 font-body">
            <NavLink to="/" end className={navLinkClassName}>
              Todo List
            </NavLink>
            <NavLink to="/todos/1" className={navLinkClassName}>
              Todo Detail
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}

