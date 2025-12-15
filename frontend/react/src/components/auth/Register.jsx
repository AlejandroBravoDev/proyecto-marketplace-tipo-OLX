import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
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
      const response = await axios.post("/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        repeatPassword: form.repeatPassword,
      });

      Swal.fire({
        title: "Usuario registrado ",
        icon: "success",
        text: response.data.msg,
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.log("Error completo:", error.response?.data);

      if (error.response?.data?.errors) {
        const formatted = {};

        error.response.data.errors.forEach((err) => {
          formatted[err.path] = err.msg;
        });

        setErrors(formatted);
      } else if (error.response?.data?.msg) {
        // Si viene un mensaje de error general
        Swal.fire({
          title: "Error",
          icon: "error",
          text: error.response.data.msg,
        });
      }

      console.log("error al registrar el usuario ", error);
    }
  };
  return (
    <>
      <div
        id="main-container"
        className="w-full min-h-screen px-4 sm:px-8 md:px-20 lg:px-40 xl:px-120 py-8 sm:py-12 md:py-20 lg:py-30 flex flex-col gap-5 text-center"
      >
        <h1 className="text-sky-600 text-3xl sm:text-4xl md:text-5xl font-bold">
          ParcheMarket
        </h1>
        <form
          action="post"
          className="w-full max-w-2xl mx-auto p-5 sm:p-6 md:p-8 lg:py-8 flex flex-col gap-4 sm:gap-5 items-center bg-white rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="border-b pb-6 sm:pb-8 w-full">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Crea una cuenta
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Es rápido y sencillo
            </p>
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Nombre"
              onChange={handleChange}
              name="name"
              className={`w-full h-11 sm:h-12 rounded-lg p-4 border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.name ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">
                {errors.name}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Correo Electrónico"
              onChange={handleChange}
              name="email"
              className={`w-full h-11 sm:h-12 rounded-lg p-4 border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">
                {errors.email}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              name="password"
              className={`w-full h-11 sm:h-12 rounded-lg p-4 border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">
                {errors.password}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Repetir Contraseña"
              onChange={handleChange}
              name="repeatPassword"
              className={`w-full h-11 sm:h-12 rounded-lg p-4 border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.repeatPassword ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.repeatPassword && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 text-left">
                {errors.repeatPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-9/12 md:w-8/12 lg:w-6/12 mt-6 sm:mt-8 lg:mt-10 bg-sky-600 text-white font-semibold text-base sm:text-lg h-11 sm:h-12 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Regístrate
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
