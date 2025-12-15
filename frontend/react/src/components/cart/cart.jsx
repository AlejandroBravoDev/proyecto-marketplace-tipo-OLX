import axios from "axios";
import { useEffect, useState } from "react";
import OrderForm from "../order/orderForm";

function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get("/api/cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems(response.data.items);
    setTotal(response.data.total);
    setTotalAmount(response.data.totalAmount);
    console.log(response.data);
  };

  const deleteProductFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Quita los decimales
    }).format(value);
  };

  return (
    <>
      <div className="w-full h-full py-15 px-30 text-center">
        <h1 className="text-3xl font-semibold">Carrito de compras </h1>
        <main className="w-full flex gap-20 p-20 rounded-lg">
          <article className="w-4/6 h-full flex flex-col gap-5 bg-white rounded-lg p-5">
            <h1 className="text-xl font-semibold">Mis Productos</h1>
            <div className="w-132 flex justify-evenly gap-10 px-5  font-semibold">
              <h2>Imagen</h2>
              <h2>Nombre</h2>
              <h2>Cantidad</h2>
              <h2>Unidad</h2>
              <h2>Total</h2>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full flex items-center justify-evenly gap-10 p-3 bg-gray-200 rounded-xl  "
              >
                <img
                  src={item.product.images}
                  className="w-15 h-15 rounded-lg"
                  alt=""
                />
                <h1 className="text-xl font-semibold">{item.product.name}</h1>
                <p>{item.amount}</p>
                <p>{formatCOP(item.unitPrice)}</p>
                <p>{formatCOP(item.subtotal)}</p>

                {/* BOTON ELIMINAR */}
                <button
                  onClick={() => deleteProductFromCart(item.id)}
                  className="w-25 h-10 bg-red-600 text-white rounded-2xl"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </article>
          <div className="w-4/12 h-50 bg-white rounded-lg p-5 flex flex-col gap-10 ">
            <h1 className="text-xl font-semibold">Confirmar Compra</h1>
            <div className="text-lg  h-full flex flex-col gap-5">
              <p>
                Subtotal ({totalAmount} productos): {formatCOP(total)}
              </p>

              <button
                onClick={() => setOpen(true)}
                className="w-full h-10 bg-sky-600 text-white rounded-2xl"
              >
                Realizar compra
              </button>
            </div>
          </div>
          {open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-xl p-15 relative">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 text-gray-500"
                >
                  ✕
                </button>

                <OrderForm close={() => setOpen(false)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Cart;
