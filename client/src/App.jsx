import { Routes, Route } from "react-router-dom";
import { Placeholder } from "./routes/Placeholder.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder />} />
    </Routes>
  );
}

export default App;
