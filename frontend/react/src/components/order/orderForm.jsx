import axios from "axios";
import { useState } from "react";

function OrderForm({ close }) {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    payMethod: "",
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
      const token = localStorage.getItem("token");
      await axios.post("/api/orders", form, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Pedido creado");
      close();
    } catch (error) {
      console.log("Error response:", error.response?.data);

      const responseErrors = error.response?.data;

      if (responseErrors) {
        if (error.response.status === 400 && responseErrors.errors) {
          const newErrors = {};
          responseErrors.errors.forEach((err) => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);

          Swal.fire({
            icon: "error",
            title: "Error de Validación",
            text: "Revisa los campos del formulario.",
          });
        } else if (responseErrors.msg) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: responseErrors.msg,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 md:gap-8">
    <h2 className="text-lg sm:text-xl font-semibold text-sky-600">
      Datos del comprador
    </h2>

    <div className="w-full">
      <input
        name="name"
        placeholder="Nombre completo"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      {errors.name && (
        <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.name}</p>
      )}
    </div>

    <div className="w-full">
      <input
        name="phoneNumber"
        type="tel"
        placeholder="Teléfono"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      {errors.phoneNumber && (
        <p className="text-red-500 text-xs sm:text-sm mt-2">
          {errors.phoneNumber}
        </p>
      )}
    </div>

    <div className="w-full">
      <input
        name="address"
        placeholder="Dirección"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      {errors.address && (
        <p className="text-red-500 text-xs sm:text-sm mt-2">
          {errors.address}
        </p>
      )}
    </div>

    <div className="w-full">
      <select
        name="payMethod"
        onChange={handleChange}
        value={form.payMethod}
        required
        className="w-full border border-gray-300 p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
      >
        <option value="">Selecciona método de pago</option>
        <option value="contra_entrega">Contra entrega</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>
      {errors.payMethod && (
        <p className="text-red-500 text-xs sm:text-sm mt-2">
          {errors.payMethod}
        </p>
      )}
    </div>

    <button
      type="submit"
      className="w-full bg-sky-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-sky-700 transition-colors mt-2 sm:mt-4"
    >
      Confirmar compra
    </button>
  </form>
);
}

export default OrderForm;
