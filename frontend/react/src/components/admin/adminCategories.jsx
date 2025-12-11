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
      <main className="w-full px-20 py-15 flex flex-row justify-between">
        {/*mis categorias*/}
        <div className="w-210 h-full flex flex-col gap-5 justify-center p-12 rounded-lg bg-white">
          <h1 className="text-xl font-semibold ">Mis categorias</h1>
          <div className="w-full h-full ">
            <ul className="w-full flex flex-col gap-8">
              {categories.length === 0 ? (
                <p>Aún no tienes categorias creadas</p>
              ) : (
                categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex flex-row justify-between items-center px-5 border border-gray-300 rounded-lg bg-gray-100 h-14"
                  >
                    {cat.name}
                    <div className="w-90 flex flex-row gap-5">
                      <select
                        value={cat.status}
                        onChange={(e) => changeStatus(cat.id, e.target.value)}
                        className="bg-white rounded-lg w-30 px-2"
                      >
                        <option value="activa">Activa</option>
                        <option value="inactive">Inactiva</option>
                      </select>
                      <button className="text-white bg-gray-400 w-30 h-8 rounded-lg">
                        Cambiar
                      </button>
                      <button
                        className="text-white bg-red-500 w-30 h-8 rounded-lg"
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
        <div className="w-120 h-full p-10 flex flex-col gap-5 justify-center bg-white rounded-lg">
          {/*input container*/}
          <h1 className="text-xl font-semibold">Crear categoria</h1>
          <form
            onSubmit={handleSubmit}
            className="w-full  flex flex-col gap-5 rounded-lg bg-gray-200 border border-gray-300 p-5"
          >
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Nombre de la categoria"
              className="bg-white w-full h-10 px-5 rounded-lg"
            />
            <button
              type="submit"
              className="text-white bg-[#3f0498] w-full 5 h-10 rounded-lg"
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
