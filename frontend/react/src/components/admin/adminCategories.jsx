import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function AdminCategories() {
  const [form, setForm] = useState({
    name: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/categories",
        { name: form.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: " Categoria creada ",
        icon: "success",
        text: response.data.msg,
      });
      fetchCategories();
    } catch (error) {
      console.log("Error completo:", error.response?.data);

      if (error.response?.data?.errors) {
        const formatted = {};
        error.response.data.errors.forEach((err) => {
          formatted[err.path] = err.msg;
        });

        setErrors(formatted);
        return;
      }

      if (error.response?.data?.msg) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: error.response.data.msg,
        });
        return;
      }

      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Ocurrió un error en el servidor",
      });

      console.log("Error al iniciar sesión:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/categories", {
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

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Categoria eliminada",
        icon: "success",
        text: "la categoria fue eliminada correctamente",
      });
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/categories/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualiza el estado en el front sin recargar
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, status: newStatus } : cat))
      );

      Swal.fire({
        title: "Estado actualizado",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <>
    {/*container principal*/}
    <main className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-15 flex flex-col lg:flex-row gap-6 lg:gap-0 lg:justify-between">
      {/*mis categorias*/}
      <div className="w-full lg:w-210 h-full flex flex-col gap-5 justify-center p-6 sm:p-8 md:p-12 rounded-lg bg-white animate-slide-in-left animate-duration-400">
        <h1 className="text-lg sm:text-xl font-semibold">Mis categorias</h1>
        <div className="w-full h-full">
          <ul className="w-full flex flex-col gap-4 sm:gap-6 md:gap-8">
            {categories.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-600">
                Aún no tienes categorias creadas
              </p>
            ) : (
              categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center px-4 sm:px-5 py-3 sm:py-0 border border-gray-300 rounded-lg bg-gray-100 sm:h-14"
                >
                  <span className="font-medium text-sm sm:text-base">
                    {cat.name}
                  </span>
                  <div className="w-full sm:w-auto flex flex-row gap-3 sm:gap-5">
                    <select
                      value={cat.status}
                      onChange={(e) => changeStatus(cat.id, e.target.value)}
                      className="bg-white rounded-lg flex-1 sm:flex-none sm:w-30 px-2 py-1 text-sm sm:text-base border border-gray-300"
                    >
                      <option value="activa">Activa</option>
                      <option value="inactive">Inactiva</option>
                    </select>
                    <button
                      className="text-white bg-red-500 flex-1 sm:flex-none sm:w-30 h-8 rounded-lg text-sm sm:text-base hover:bg-red-600 transition-colors"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/*input y botón para crear la categoria*/}
      <div className="w-full lg:w-120 h-full p-6 sm:p-8 md:p-10 flex flex-col gap-5 justify-center bg-white rounded-lg animate-slide-in-right animate-duration-400">
        {/*input container*/}
        <h1 className="text-lg sm:text-xl font-semibold">Crear categoria</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 rounded-lg bg-gray-200 border border-gray-300 p-4 sm:p-5"
        >
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Nombre de la categoria"
            className="bg-white w-full h-10 sm:h-12 px-4 sm:px-5 rounded-lg text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.name}
            </p>
          )}
          <button
            type="submit"
            className="text-white bg-sky-600 w-full h-10 sm:h-12 rounded-lg text-sm sm:text-base hover:bg-sky-700 transition-colors"
          >
            Crear categoria
          </button>
        </form>
      </div>
    </main>
  </>
);
}

export default AdminCategories;
