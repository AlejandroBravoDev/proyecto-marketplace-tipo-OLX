import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";

function CategoriesNav({ onSelectCategory }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/categories/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.categories);
      console.log("Respuesta categorías:", response.data);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <nav className="w-full h-10 bg-white  sm:mt-8 md:mt-10 animate-slide-in-top animate-duration-400">
        {/* Desktop */}
        <ul className="hidden lg:flex w-full h-10 flex-row justify-between items-center px-10 md:px-12 lg:px-20 text-sky-600">
          <Link to="/">
            <li className="cursor-pointer hover:bg-sky-600 hover:text-white px-4 py-0.5 rounded-sm transition-colors duration-400">
              Ver todos
            </li>
          </Link>
          {categories.length === 0 ? (
            <p className="text-sm">No hay categorías creadas</p>
          ) : (
            categories.map((cat) => (
              <li
                onClick={() => onSelectCategory(cat.id)}
                className="cursor-pointer hover:bg-sky-600 hover:text-white px-4 py-0.5 rounded-sm transition-colors duration-400"
                key={cat.id}
              >
                {cat.name}
              </li>
            ))
          )}
        </ul>

        {/* Mobile y Tablet - Dropdown */}
        <div className="lg:hidden w-full px-4 py-3">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                window.location.href = "/";
              } else {
                onSelectCategory(Number(value));
              }
            }}
            className="w-full h-12 px-4 rounded-lg bg-white text-sky-600 font-medium text-base focus:outline-none focus:ring-2 focus:ring-sky-300"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            <option value="all">Ver todos</option>
            {categories.length === 0 ? (
              <option disabled>No hay categorías creadas</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>
      </nav>
    </>
  );
}

export default CategoriesNav;
