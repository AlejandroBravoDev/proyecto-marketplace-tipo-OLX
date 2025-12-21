//este se va a usar para el perfil del admin y para administrar productos que seria mis productos
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function AdminProductsCards() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (pro) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`api/products/${pro.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Producto eliminado",
        icon: "success",
        text: "El producto fue eliminado correctamente",
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Quita los decimales
    }).format(value);
  };
  return (
    <>
      <div className="w-full min-h-screen flex gap-6 sm:gap-8 md:gap-10 flex-wrap py-6 sm:py-8 md:py-10 px-4 sm:px-8 md:px-12 lg:px-20 justify-center">
        {products.length === 0 ? (
          <div className="w-full flex flex-col items-center gap-6 py-20">
            <p className="text-lg sm:text-xl text-gray-600">
              No tienes productos creados
            </p>
            <Link to={"/"}>
              <button className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors">
                Crear primer producto
              </button>
            </Link>
          </div>
        ) : (
          products.map((pro) => (
            <div
              key={pro.id}
              className="w-full sm:w-80 md:w-90 h-120 hover:scale-103 transition-transform duration-300 flex flex-col gap-2 rounded-lg bg-white text-sm shadow-lg hover:shadow-xl animate-fade-in animate-duration-400"
            >
              {/* Imagen del producto */}
              <div className="w-full h-48 sm:h-56 md:h-60 rounded-t-lg overflow-hidden">
                {pro.productImages && pro.productImages.length > 0 ? (
                  (() => {
                    const raw = pro.productImages[0].url;
                    let url = null;
                    if (Array.isArray(raw)) url = raw[0];
                    else if (typeof raw === "string") {
                      try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) url = parsed[0];
                        else url = raw;
                      } catch (e) {
                        url = raw;
                      }
                    } else {
                      url = raw;
                    }

                    return url ? (
                      <img
                        src={pro.images}
                        alt={pro.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-600 flex items-center justify-center">
                        <span className="text-white text-sm">Sin imagen</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full h-full bg-sky-600 flex items-center justify-center">
                    <span className="text-white text-sm">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="flex flex-col p-4 sm:p-5 gap-2 w-full">
                <h1 className="text-lg sm:text-xl font-semibold wrap-break-word line-clamp-2">
                  {pro.name}
                </h1>

                <div className="flex flex-col gap-1 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold">Precio: </span>
                    {formatCOP(pro.price)}
                  </p>
                  <p>
                    <span className="font-semibold">Stock: </span>
                    {pro.stock}
                  </p>
                  <p className="pb-3">
                    <span className="font-semibold">Categoría: </span>
                    {pro.category.name}
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                  <Link to={`/editProduct/${pro.id}`} className="flex-1">
                    <button className="w-full h-9 sm:h-10 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors text-sm sm:text-base">
                      Editar
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteProduct(pro)}
                    className="flex-1 h-9 sm:h-10 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AdminProductsCards;
