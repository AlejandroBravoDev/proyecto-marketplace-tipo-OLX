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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h2 className="text-xl text-sky-600 font-semibold ">
        Datos del comprador
      </h2>

      <input
        name="name"
        placeholder="Nombre completo"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded-xl "
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}

      <input
        name="phoneNumber"
        placeholder="Teléfono"
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-xl "
      />
         {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
      <input
        name="address"
        placeholder="Dirección"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded-xl "
      />
      {errors.adress && (
            <p className="text-red-500 text-sm mt-1">{errors.adress}</p>
          )}

      <select
        name="payMethod"
        id=""
        onChange={handleChange}
        value={form.payMethod}
      >
        <option value="">selecciona metodo de pago</option>
        <option value="contra_entrega">Contra entrega</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>
      {errors.payMethod && (
            <p className="text-red-500 text-sm mt-1">{errors.payMethod}</p>
          )}

      <button className="w-full bg-black text-white py-2 rounded">
        Confirmar compra
      </button>
    </form>
  );
}

export default OrderForm;
