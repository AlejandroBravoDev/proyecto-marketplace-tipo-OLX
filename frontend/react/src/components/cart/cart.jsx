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
      <div className="w-full min-h-screen py-6 sm:py-10 md:py-15 px-4 sm:px-8 md:px-16 lg:px-30 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
          Carrito de compras
        </h1>
        <main className="w-full flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-20 p-4 sm:p-8 md:p-12 lg:p-20 rounded-lg">
          <article className="w-full lg:w-4/6 h-full flex flex-col gap-4 sm:gap-5 bg-white rounded-lg p-4 sm:p-5 animate-slide-in-left animate-duration-400">
            <h1 className="text-lg sm:text-xl font-semibold text-left">
              Mis Productos
            </h1>

            {/* Header - Oculto en móvil */}
            <div className="hidden md:flex w-full justify-evenly gap-4 lg:gap-10 px-5 font-semibold text-sm lg:text-base">
              <h2 className="w-20">Imagen</h2>
              <h2 className="flex-1">Nombre</h2>
              <h2 className="w-20">Cantidad</h2>
              <h2 className="w-24">Unidad</h2>
              <h2 className="w-24">Total</h2>
              <h2 className="w-24">Acción</h2>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 py-10">Tu carrito está vacío</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex flex-col md:flex-row md:items-center md:justify-evenly gap-3 md:gap-4 lg:gap-10 p-3 sm:p-4 bg-gray-200 rounded-xl"
                >
                  {/* Móvil: Layout vertical */}
                  <div className="flex gap-4 md:hidden">
                    <img
                      src={item.product.images}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      alt={item.product.name}
                    />
                    <div className="flex flex-col gap-2 flex-1 text-left">
                      <h2 className="text-base sm:text-lg font-semibold">
                        {item.product.name}
                      </h2>
                      <div className="text-sm text-gray-700">
                        <p>Cantidad: {item.amount}</p>
                        <p>Precio: {formatCOP(item.unitPrice)}</p>
                        <p className="font-semibold">
                          Total: {formatCOP(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: Layout horizontal */}
                  <img
                    src={item.product.images}
                    className="hidden md:block w-15 h-15 rounded-lg object-cover"
                    alt={item.product.name}
                  />
                  <h2 className="hidden md:block text-base lg:text-lg font-semibold flex-1">
                    {item.product.name}
                  </h2>
                  <p className="hidden md:block w-20 text-sm lg:text-base">
                    {item.amount}
                  </p>
                  <p className="hidden md:block w-24 text-sm lg:text-base">
                    {formatCOP(item.unitPrice)}
                  </p>
                  <p className="hidden md:block w-24 text-sm lg:text-base font-semibold">
                    {formatCOP(item.subtotal)}
                  </p>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => deleteProductFromCart(item.id)}
                    className="w-full md:w-24 h-9 sm:h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </article>

          <div className="w-full lg:w-4/12 bg-white rounded-lg p-4 sm:p-5 flex flex-col gap-6 sm:gap-10 animate-slide-in-right animate-duration-400 lg:sticky lg:top-4 self-start">
            <h1 className="text-lg sm:text-xl font-semibold">
              Confirmar Compra
            </h1>
            <div className="text-base sm:text-lg h-full flex flex-col gap-4 sm:gap-5">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  Subtotal ({totalAmount}{" "}
                  {totalAmount === 1 ? "producto" : "productos"}):
                </p>
                <p className="text-xl sm:text-2xl font-bold text-sky-600">
                  {formatCOP(total)}
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                disabled={items.length === 0}
                className="w-full h-11 sm:h-12 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base sm:text-lg font-semibold"
              >
                Realizar compra
              </button>
            </div>
          </div>

          {open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-lg rounded-xl p-6 sm:p-8 md:p-15 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
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
