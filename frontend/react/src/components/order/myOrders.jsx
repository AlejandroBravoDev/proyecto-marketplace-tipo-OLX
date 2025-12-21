import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

function MyOrders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
      console.log(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders); // 👈 CLAVE
      console.log(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllOrders();
    } else {
      fetchOrders();
    }
  }, [isAdmin]);

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Error cancelando pedido");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.msg);

      fetchOrders();
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert(
        error.response?.data?.msg || "Error actualizando el estado del pedido"
      );
    }
  };
  return (
    <main className="w-full py-6 sm:py-10 md:py-15 px-4 sm:px-8 md:px-12 lg:px-20">
      {/* CARDS CONTAINER */}
      <div className="w-full p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 md:gap-10 bg-white rounded-lg animate-fade-in animate-duration-400">
        <h1 className="text-xl sm:text-2xl font-bold">Mis Órdenes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-base sm:text-lg">
              No has hecho ningún pedido
            </p>
          </div>
        ) : (
          orders.map((order) => (
            // CARDS
            <div
              key={order.id}
              className="w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-10 lg:gap-20 p-4 sm:p-6 bg-sky-200 rounded-xl sm:rounded-2xl"
            >
              {/* ID del pedido */}
              <div className="shrink-0">
                <h2 className="font-semibold text-base sm:text-lg">
                  Pedido #{order.id.slice(0, 8)}
                </h2>
              </div>

              {/* Nombre del cliente */}
              <div className="flex-1">
                <h2 className="text-sm sm:text-base">
                  A nombre de{" "}
                  <span className="font-semibold">{order.name}</span>
                </h2>
              </div>

              {/* Estado - Admin o Cliente */}
              {isAdmin ? (
                <div className="w-full sm:w-auto">
                  <select
                    name="status"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="w-full sm:w-40 h-10 px-3 rounded-lg border border-sky-600 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={order.status}>{order.status}</option>
                    <option value="enviado">Enviado</option>
                    <option value="cancelado">Cancelar</option>
                  </select>
                </div>
              ) : (
                <div className="shrink-0">
                  <h2 className="text-sm sm:text-base">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        order.status === "pendiente"
                          ? "text-yellow-600"
                          : order.status === "enviado"
                          ? "text-green-600"
                          : order.status === "cancelado"
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </h2>
                </div>
              )}

              {/* Botón cancelar */}
              {order.status === "pendiente" && (
                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="w-full sm:w-40 h-10 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default MyOrders;
