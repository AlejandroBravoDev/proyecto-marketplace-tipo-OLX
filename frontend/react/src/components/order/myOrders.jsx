import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

function MyOrders() {
  const isAdmin = useAuth();
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

  useEffect(() => {
    fetchOrders();
  }, []);

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

      // 🔄 refrescar pedidos
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || "Error cancelando pedido");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Evita la actualización si el estado es el mismo o si no se selecciona uno válido (opcional)
    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus }, // 👈 Envía el nuevo estado en el cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Muestra un mensaje de éxito (opcional)
      console.log(response.data.msg);

      // 🔄 Refrescar los pedidos para ver el cambio
      fetchOrders();
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      alert(
        error.response?.data?.msg || "Error actualizando el estado del pedido"
      );
    }
  };
  return (
    <main className="w-full py-15 px-20">
      {/* CARDS CONTAINER */}
      <div className="w-full p-10 flex flex-col gap-10 bg-white rounded-lg">
        {orders.length === 0 ? (
          <p>No has hecho ningún pedido</p>
        ) : (
          orders.map((order) => (
            // CARDS
            <div
              key={order.id}
              className="w-full flex items-center gap-20 p-6 bg-sky-200 rounded-2xl"
            >
              <h2 className="font-semibold text-lg">
                Pedido #{order.id.slice(0, 8)}
              </h2>
              {/* {order.items.map((item) => (
                <div
                  key={item.id}
                  className="ml-4 mt-2 w-120 flex justify-between items-center"
                >
                  <img src={item.product.images} alt="" className="w-20" />
                  <h2>
                    {" "}
                    <span className="font-semibold">{item.product.name}</span>
                  </h2>
                  <span>Cant: {item.amount}</span>
                </div>
              ))} */}
              <h2>
                a nombre de <span className="font-semibold">{order.name}</span>
              </h2>

              {isAdmin ? (
                <>
                  <select
                    name="status"
                    id=""
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="">{order.status}</option>
                    <option value="enviado">Enviado</option>
                    <option value="cancelado">Cancelar</option>
                  </select>
                </>
              ) : (
                <>
                  <h2>
                    Estado <span className="font-semibold">{order.status}</span>
                  </h2>
                </>
              )}
              {order.status === "pendiente" && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="w-40 h-10 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default MyOrders;
