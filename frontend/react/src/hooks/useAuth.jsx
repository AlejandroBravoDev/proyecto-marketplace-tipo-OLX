// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { getUser, getToken } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = getUser();

    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin"); // 🔥 VERIFICAR SI ES ADMIN
    }
    setLoading(false);
  }, []);

  return { user, isAuthenticated, loading, isAdmin };
};
