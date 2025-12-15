import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
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
      const response = await axios.post("/api/users/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Swal.fire({
        title: "Login exitoso ",
        icon: "success",
        text: response.data.msg,
      }).then(() => {
        navigate("/");
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

      console.log("Error al iniciar sesión:", error);
    }
  };

  return (
    <>
      {/*div que va a hacer el padding para que se vea más al centro*/}
      <div
        className="w-full min-h-screen flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 sm:py-12 md:py-20 lg:py-40 px-4 sm:px-8 md:px-16 lg:px-70 items-center lg:items-start"
        id="main-container"
      >
        <article className="w-full lg:w-6/12 flex flex-col gap-4 sm:gap-6 md:gap-8 text-center lg:text-left">
          <h1 className="text-sky-600 text-3xl sm:text-4xl md:text-5xl font-bold">
            ParcheMarket
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-full lg:max-w-100 mx-auto lg:mx-0">
            Únete a ParcheMarket, el marketplace que te conecta con los mejores
            productos y servicios. Regístrate o inicia sesión para comprar,
            vender y acceder a ofertas exclusivas. ¡Es rápido, seguro y está
            hecho para ti!
          </p>
        </article>

        <form
          action="post"
          className="w-full sm:w-96 md:w-105 bg-white shadow-xl rounded-2xl flex flex-col gap-4 sm:gap-5 p-5 sm:p-6 md:p-8 text-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Correo Electrónico"
            name="email"
            className={`w-full border h-11 sm:h-12 rounded-lg p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.email ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm -mt-2 w-full text-left">
              {errors.email}
            </p>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            className={`w-full border h-11 sm:h-12 rounded-lg p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm -mt-2 w-full text-left">
              {errors.password}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-sky-600 text-white font-semibold text-base sm:text-lg h-11 sm:h-12 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          <Link to="/forgotPassword">
            <p className="text-sky-600 text-sm sm:text-base hover:underline">
              ¿Olvidaste tu Contraseña?
            </p>
          </Link>

          <hr className="border-gray-400 w-full" />

          <Link to={"/register"} className="w-full sm:w-4/6">
            <button className="w-full bg-sky-600 text-white font-semibold text-base sm:text-lg h-11 sm:h-12 rounded-lg hover:bg-sky-700 transition-colors">
              Crear una cuenta nueva
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
