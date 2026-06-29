# Features & Functionality

## 1. Todo List Page (`/`)

| Feature | Description |
|---|---|
| **Bento dashboard layout** | Hero greeting, date tile, stat cards (Total / Active / Overdue / Done), and a controls + content area. |
| **Card grid list** | Todos displayed as cards grouped by due-date sections: Overdue, Today, This Week, Later, No Due Date, and Completed. |
| **Search** | Debounced search bar (300 ms) filtering todos by title and description via the server. |
| **Filter by status** | Pill toggle: All / Active / Done. |
| **Filter by priority** | Dropdown: Any / High / Medium / Low. |
| **Filter by tag** | Dropdown populated from tags on the current page of results. |
| **Sort** | Dropdown with six options: newest, oldest, due soonest, due latest, priority descending, priority ascending. |
| **Pagination** | Server-side pagination with page controls (`TodoPagination`). Default 10 items per page. |
| **Priority indicator** | Colored dot on each card (high / medium / low). |
| **Due date highlighting** | Due dates color-coded: normal, due soon (within 48 hours), and overdue. |
| **Tags/labels** | Up to three tag chips shown per card, with a `+N` overflow indicator. |
| **Mark complete/incomplete** | Checkmark button toggles status; completed cards show strikethrough title and description. |
| **Create todo** | **New task** button navigates to `/todos/new` (full-page form with Zod validation). |
| **Edit todo** | Pencil icon navigates to `/todos/:id/edit` (full-page form). |
| **Delete todo** | Trash icon opens an inline confirm toast before deleting. |
| **Bulk selection** | **Select** mode reveals checkboxes; select all on page, bulk complete, or bulk delete. |
| **Optimistic UI updates** | Status toggles and deletes reflect instantly, rolling back automatically on failure. |
| **Toast notifications** | Success/error toasts for create, update, delete, and failed actions. |
| **Empty state** | Clear message and create shortcut when no todos match the current filters. |
| **Loading skeletons** | Six skeleton cards shown while the list is fetching. |
| **URL-persisted filters** | Search, filters, sort, and page are stored in URL query params for shareable list views. |

---

## 2. Todo Detail Page (`/todos/:id`)

| Feature | Description |
|---|---|
| **Full detail view** | Title, description, status, priority, due date, tags, and timestamps. |
| **Inline editing** | Click-to-edit fields for title, description, status, priority, due date, and tags — validated with Zod before save. |
| **Activity timeline** | Shows Created and Last edited timestamps when they differ. |
| **Edit page link** | **Edit** button navigates to `/todos/:id/edit` with list query params preserved. |
| **Delete with confirmation** | **Delete** button triggers a confirm toast, then navigates back to the list. |
| **Filter-preserving navigation** | **Back** link returns to the list with previous search/filter/sort state intact. |
| **404 / not-found handling** | Invalid or missing todo IDs show a clear not-found state instead of a blank page. |
| **Loading skeleton** | Skeleton placeholder while the todo is being fetched. |

---

## 3. Todo Form Pages (`/todos/new`, `/todos/:id/edit`)

| Feature | Description |
|---|---|
| **Full-page create form** | React Hook Form + Zod validation for title, description, due date, priority, and tags. |
| **Full-page edit form** | Pre-filled from the server; saves via `PUT` and redirects to the detail page. |
| **Live preview sidebar** | Shows initials avatar, priority label, due date, and unsaved-changes indicator. |
| **Cancel / back navigation** | Returns to the list (create) or preserves query params on redirect (edit → detail). |
| **Not-found handling** | Edit mode validates the ID and shows a not-found state for invalid or missing todos. |

---

## 4. Global / Cross-Cutting Features

| Feature | Description |
|---|---|
| **Multi-page architecture** | React Router navigates between list, detail, create, and edit pages — not a single page with conditional sections. |
| **Responsive layout** | Layout adapts from mobile (single column) to desktop (centered max-width shell). |
| **Custom visual design** | Fraunces + DM Sans font pairing, CSS custom-property color tokens, bento-style tiles, and card-based task layout. |
| **Toast + confirm system** | `ToastContext` provides dismissible success/error toasts and inline confirm dialogs for destructive actions. |
| **Dev API proxy** | Vite proxies `/api` to `localhost:5000` so the client can use relative API paths during development. |

---

## 5. Backend Features

| Feature | Description |
|---|---|
| **RESTful CRUD API** | Full Create/Read/Update/Delete for todos at `/api/v1/todos`. |
| **Filtering, search & sort (server-side)** | List endpoint supports `status`, `priority`, `tag`, `search`, `sort`, `page`, and `limit` query params. |
| **MongoDB persistence** | All todo data stored in MongoDB via Mongoose. |
| **Centralized error handling** | Single middleware handles Mongoose validation, cast, and duplicate key errors. |
| **Request validation** | `validateTodo` middleware validates create and full-update request bodies. |
| **Health check endpoint** | `GET /api/v1/health` confirms the server is running. |
| **Seed script** | `node src/config/seed.js` populates the database with seven sample todos. |

See **API.md** for the full endpoint reference and **ARCHITECTURE.md** for system design and data flow diagrams.
