# Tasklin — Todo Application

A full-stack todo application built with **React** (frontend) and **Node.js + Express + MongoDB** (backend). The server follows an MVC layout; the client is a multi-page React app with Redux Toolkit for state and React Router for navigation.

---

## Tech Stack

**Frontend**
- React 19 (JavaScript)
- React Router DOM (multi-page routing)
- Redux Toolkit (state management)
- Zod + React Hook Form (form validation)
- Tailwind CSS + shadcn/ui-style Dialog primitives
- lucide-react (icons)
- Vite (dev server and build)

**Backend**
- Node.js + Express 5 (JavaScript)
- MongoDB + Mongoose (database / ODM)
- MVC folder structure
- RESTful API under `/api/v1`

---

## Project Structure

```
ZipTrripProject/
├── client/                      # React frontend
│   ├── src/
│   │   ├── pages/               # TodoListPage, TodoDetailPage, TodoFormPage
│   │   ├── components/          # Layout, todo UI, shared UI
│   │   ├── features/todos/      # todosSlice (Redux)
│   │   ├── app/                 # Redux store configuration
│   │   ├── services/            # todoService.js (HTTP layer)
│   │   ├── context/             # ToastContext (toasts + confirm dialogs)
│   │   ├── hooks/               # useDebounce, etc.
│   │   ├── lib/validations/     # Zod schemas
│   │   └── utils/               # list query params, todo helpers
│   ├── vite.config.js           # Dev proxy: /api → localhost:5000
│   └── package.json
├── server/                      # Express backend
│   ├── src/
│   │   ├── models/              # todo.model.js
│   │   ├── controllers/         # todo.controller.js
│   │   ├── routes/              # todo.routes.js, health.js
│   │   ├── middlewares/         # validateTodo.js, errorHandler.js
│   │   ├── config/              # db.js, seed.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── README.md
├── FEATURES.md
├── API.md
└── ARCHITECTURE.md
```

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB connection string (local instance or MongoDB Atlas)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ZipTrripProject
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (copy from `.env.example`):

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
```

Seed the database with sample data (run once):

```bash
node src/config/seed.js
```

Start the backend server:

```bash
npm start
```

The API is available at `http://localhost:5000/api/v1`.

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` (Vite default). During development, Vite proxies `/api` requests to the backend on port 5000.

---

## Using the App

1. Open `http://localhost:5173` — you land on the **Tasks** list page.
2. Use the **search bar**, **status/priority/tag filters**, and **sort** controls to refine the list.
3. Click **New task** to open the create page (`/todos/new`).
4. Click a task title to open its **detail page** (`/todos/:id`) for inline editing and activity history.
5. Use the **Edit** link on a row or the detail page to open the full edit form (`/todos/:id/edit`).
6. Delete tasks via the trash icon — a confirmation toast appears before removal.
7. Enable **Select** mode to bulk-complete or bulk-delete multiple tasks.

List filters and pagination are stored in the URL query string, so returning from a detail or form page preserves your view.

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | `server/.env` | Port the Express server listens on (default `5000`) |
| `MONGODB_URI` | `server/.env` | MongoDB connection string |
| `VITE_API_BASE_URL` | `client/.env` (optional) | API base path; defaults to `/api/v1` (works with the Vite dev proxy) |

---

## Scripts Reference

| Command | Location | Purpose |
|---|---|---|
| `npm start` | `server/` | Start the Express API server |
| `node src/config/seed.js` | `server/` | Seed the database with sample todos |
| `npm run dev` | `client/` | Start the Vite dev server |
| `npm run build` | `client/` | Build the production frontend bundle |
| `npm run preview` | `client/` | Preview the production build locally |
| `npm run lint` | `client/` | Run ESLint |

See **FEATURES.md** for the full feature list, **API.md** for the REST API reference, and **ARCHITECTURE.md** for system design and data flow diagrams.
