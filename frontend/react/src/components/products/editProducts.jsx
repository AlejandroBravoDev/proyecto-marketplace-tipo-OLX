import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";

function EditProducts() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/");
  } else if (!isAuthenticated) {
    navigate("/login");
  }
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  return (
    <>
      <h1>Hola soy homelo chino</h1>
    </>
  );
}
