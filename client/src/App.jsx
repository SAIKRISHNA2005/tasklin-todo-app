import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { TodoListPage } from "./pages/TodoListPage.jsx";
import { TodoDetailPage } from "./pages/TodoDetailPage.jsx";
import { TodoFormPage } from "./pages/TodoFormPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/todos/new" element={<TodoFormPage mode="create" />} />
        <Route path="/todos/:id" element={<TodoDetailPage />} />
        <Route path="/todos/:id/edit" element={<TodoFormPage mode="edit" />} />
      </Route>
    </Routes>
  );
}

export default App;
