import ForgotPassword from "./components/auth/forgotPassword";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ResetPassword from "./components/auth/resetPassword";
import AdminCategories from "./pages/admin/adminCategories";
import AdminProductsPage from "./pages/admin/adminProducts";
import CreateProductPage from "./pages/admin/createProduct";
import EditProductsPage from "./pages/admin/editProduct";
import Index from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PanelAdminPage from "./pages/admin/panel";

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
      <Route path="/adminProducts" element={<AdminProductsPage/>}/>
      <Route path="/createProducts" element={<CreateProductPage/>}/>
      <Route path="/editProduct/:id" element={<EditProductsPage/>}/>
      <Route path="/panelAdmin" element={<PanelAdminPage/>}/>

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
