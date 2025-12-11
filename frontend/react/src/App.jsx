import ForgotPassword from "./components/auth/forgotPassword";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ResetPassword from "./components/auth/resetPassword";
import AdminCategories from "./pages/admin/adminCategories";
import Index from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />

      {/*rutas admin*/}
      <Route path="/adminCategories" element={<AdminCategories />} />
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
