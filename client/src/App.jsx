import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { TodoListPage } from "./pages/TodoListPage.jsx";
import { TodoDetailPage } from "./pages/TodoDetailPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/todos/:id" element={<TodoDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
