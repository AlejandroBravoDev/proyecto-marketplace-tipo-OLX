import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Rutas />
      </div>
    </BrowserRouter>
  );
}

export default App;
