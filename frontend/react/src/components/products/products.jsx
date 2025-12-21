//este va a ser el componente del index
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

function ProductsCards({ products }) {
  const { isAdmin } = useAuth();

  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Quita los decimales
    }).format(value);
  };
  return (
    <>
      <div className="w-full flex gap-6 sm:gap-8 md:gap-10 flex-wrap py-6 sm:py-8 md:py-10 px-4 sm:px-8 md:px-12 lg:px-20 items-center justify-center animate-fade-in animate-duration-400">
        {/* Card para crear producto (solo admin) */}
        {isAdmin && (
          <Link to={"/createProducts"} className="w-full sm:w-80 md:w-90">
            <div className="w-full h-96 sm:h-110 md:h-120 flex flex-col justify-center items-center gap-4 sm:gap-5 border-2 border-sky-600 border-dashed rounded-lg bg-white text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
              <div className="w-full h-full bg-[#04429817] flex flex-col justify-center items-center gap-4 sm:gap-5 rounded-lg">
                <h1 className="font-bold text-5xl sm:text-6xl text-sky-600">
                  +
                </h1>
                <h1 className="font-semibold text-xl sm:text-2xl text-center px-4">
                  Crear un Producto
                </h1>
              </div>
            </div>
          </Link>
        )}

        {/* Mensaje cuando no hay productos */}
        {products.length === 0 ? (
          <div className="w-full flex flex-col items-center gap-4 py-20">
            <p className="text-lg sm:text-xl text-gray-600">
              No hay productos disponibles
            </p>
          </div>
        ) : (
          // Grid de productos
          products.map((pro) => (
            <div
              key={pro.id}
              className="w-full sm:w-80 md:w-90 h-auto flex flex-col gap-2 rounded-lg bg-white text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300"
            >
              {/* Imagen del producto */}
              <div className="w-full h-48 sm:h-52 md:h-55 rounded-t-lg overflow-hidden">
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
              <div className="flex flex-col p-4 sm:p-6 md:p-8 gap-2 w-full">
                <h1 className="text-lg sm:text-xl font-semibold wrap-break-word line-clamp-2 mb-2">
                  {pro.name}
                </h1>

                <div className="flex flex-col gap-1 text-sm sm:text-base mb-4">
                  <p>
                    <span className="font-semibold">Precio: </span>
                    <span className="text-sky-600 font-bold">
                      {formatCOP(pro.price)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Stock: </span>
                    <span
                      className={
                        pro.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pro.stock}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Categoría: </span>
                    {pro.category.name}
                  </p>
                </div>

                {/* Botón comprar */}
                <Link to={`/purchaseProduct/${pro.id}`} className="w-full">
                  <button
                    disabled={pro.stock === 0}
                    className="w-full h-10 sm:h-11 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {pro.stock > 0 ? "Comprar" : "Sin stock"}
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ProductsCards;
