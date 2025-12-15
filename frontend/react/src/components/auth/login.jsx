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
        className="w-full h-210 flex flex-row gap-10 py-40 px-70 "
        id="main-container"
      >
        <article className=" w-6/12 h-4/6 flex flex-col gap-8 max-h-full">
          <h1 className="text-sky-600 text-5xl font-bold">ParcheMarket</h1>
          <p className="text-2xl max-w-100">
            Únete a ParcheMarket, el marketplace que te conecta con los mejores
            productos y servicios. Regístrate o inicia sesión para comprar,
            vender y acceder a ofertas exclusivas. ¡Es rápido, seguro y está
            hecho para ti!
          </p>
        </article>

        <form
          action="post"
          className="w-105 h-95 bg-white shadow-xl rounded-2xl flex flex-col gap-5 p-5 text-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Correo Electronico"
            name="email"
            className={`w-full border border-gray-400 h-12 rounded-lg p-4 ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            className={`w-full border border-gray-400 h-12 rounded-lg p-4 ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full bg-sky-600 text-white font-semibold text-lg h-12 rounded-lg"
          >
            Iniciar Sesión
          </button>
          <Link to="/forgotPassword">
            <p className="text-sky-600">¿Olvidaste tu Contraseña?</p>
          </Link>

          <hr className="border-gray-400 w-full" />

          <Link to={"/register"} className="w-4/6">
            <button className="w-full bg-sky-600  text-white font-semibold  h-12 rounded-lg">
              Crear una cuenta nueva
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
