import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
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
      const response = await axios.post("/api/users/forgotPassword", {
        email: form.email,
      });

      Swal.fire({
        title: "Has cambiado tu contraseña",
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

      console.log("Error al enviar el correo", error);
    }
  };

  return (
    <>
      <div className="w-full h-110 py-20 px-120">
        <form
          action="post"
          className="w-full h-80 bg-white rounded-xl shadow-xl text-start flex flex-col items-center justify-evenly"
          onSubmit={handleSubmit}
        >
          <h1 className="px-5 text-xl font-semibold">Recupera tu cuenta</h1>
          <hr className="border-gray-200 w-full" />

          <p className=" px-5">
            Ingresa el correo electrónico de tu cuenta y te enviaremos un correo
            con un link en el que podrás modificar tu contraseña
          </p>

          <input
            type="text"
            onChange={handleChange}
            name="email"
            className="w-135 border border-gray-400 h-12 rounded-lg p-4  "
            placeholder="Correo electrónico"
          />

          <hr className="border-gray-200 w-full " />

          <div
            id="buttons"
            className="w-full flex flex-row gap-5 justify-end pr-5"
          >
            <Link to="/login">
              <button className="w-25 h-9 bg-gray-300 rounded-lg  ">
                Volver
              </button>
            </Link>
            <button className="w-25 h-9 bg-[#3f0498] text-white rounded-lg  ">
              Envíar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
