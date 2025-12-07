import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

function Register() {
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
        className="w-full h-full px-120 py-30 flex flex-col gap-5 text-center"
      >
        <h1 className="text-[#006e18] text-5xl font-bold">ParcheMarket</h1>
        <form
          action="post"
          className="w-full h-full p-5 py-8 flex flex-col gap-5 items-center bg-white rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="border-b pb-8 w-full">
            <h2 className="text-2xl font-semibold">Crea una cuenta</h2>
            <p className="text-gray-500 text-lg">Es rapido y sencillo</p>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Nombre"
              onChange={handleChange}
              name="name"
              className={`w-full h-12 rounded-lg p-4 border ${
                errors.name ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Correo Electronico"
              onChange={handleChange}
              name="email"
              className={`w-full h-12 rounded-lg p-4 border ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              name="password"
              className={`w-full h-12 rounded-lg p-4 border ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="w-full">
            <input
              type="password"
              placeholder="Repetir Contraseña"
              onChange={handleChange}
              name="repeatPassword"
              className={`w-full h-12 rounded-lg p-4 border ${
                errors.repeatPassword ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.repeatPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.repeatPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-6/12 mt-10 bg-[#006e18] text-white font-semibold text-lg h-12 rounded-lg"
          >
            Registrate
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
