import axios from "axios";
import { useState } from "react";

function OrderForm({ close }) {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    payMethod: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      console.error(error);
      alert("Error al crear pedido");
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

      <input
        name="phoneNumber"
        placeholder="Teléfono"
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-xl "
      />

      <input
        name="address"
        placeholder="Dirección"
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded-xl "
      />

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

      <button className="w-full bg-black text-white py-2 rounded">
        Confirmar compra
      </button>
    </form>
  );
}

export default OrderForm;
