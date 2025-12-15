import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
  });

  const [errors, setErrors] = useState({});

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
      const response = await axios.post(`/api/users/resetPassword/${token}`, {
        password: form.password,
      });

      Swal.fire({
        title: "Login exitoso ",
        icon: "success",
        text: response.data.msg,
      });
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

      console.log("Error al cambiar de contraseña", error);
    }
  };
  return (
  <>
    <div className="w-full min-h-screen flex items-center justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-8 md:px-16 lg:px-40 xl:px-120">
      <form
        action="post"
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl text-start flex flex-col gap-5 sm:gap-6 p-5 sm:p-6 md:p-8"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Nueva contraseña</h1>
        </div>

        <hr className="border-gray-200 w-full" />

        <p className="text-sm sm:text-base text-gray-700">
          Ingresa la nueva contraseña que vas a tener en ParcheMarket
        </p>

        <div className="w-full">
          <input
            type="password"
            onChange={handleChange}
            name="password"
            className="w-full border border-gray-400 h-11 sm:h-12 rounded-lg p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Nueva contraseña"
          />
        </div>

        <hr className="border-gray-200 w-full" />

        <div
          id="buttons"
          className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5 sm:justify-end"
        >
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-25 h-10 sm:h-9 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base font-medium">
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            className="w-full sm:w-25 h-10 sm:h-9 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm sm:text-base font-medium"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  </>
);
}

export default ResetPassword;
