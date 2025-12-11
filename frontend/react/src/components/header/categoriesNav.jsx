
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";

function CategoriesNav() {
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
      <nav className="w-full h-15 bg-[#3f0498] mt-10">
        <ul className="w-full h-full flex flex-row justify-between items-center px-20 text-white">
          {categories.length === 0 ? (
            <p>no hay categorias creadas</p>
          ):(
            categories.map((cat) =>(

            <li key={cat.id}>    
                {cat.name}
            </li>
            ))
          )}
          {isAdmin ? (
            <>
              <Link to="/adminCategories">
                <button className="w-35 h-10  rounded-lg text-[#3f0498]  bg-white">
                  Crear categoria
                </button>
              </Link>
            </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </>
  );
}

export default CategoriesNav;
