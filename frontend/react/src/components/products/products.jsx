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
      <div className="w-full flex gap-10 flex-wrap py-10 px-20 grid-cols-4 items-center justify-center animate-fade-in animate-duration-400">
        {isAdmin ? (
          <>
            <Link to={"/createProducts"}>
              <div className=" w-90 h-120 flex flex-col justify-center items-center gap-5 border-2 border-[#3f0498] border-dashed rounded-lg bg-white text-sm shadow-[10px_15px_15px_rgba(0,0,0,.1)] hover:scale-102  transition-transform duration-300">
                <div className="w-full h-full bg-[#04429817] flex flex-col justify-center items-center gap-5">
                  <h1 className="font-bold text-6xl">+</h1>
                  <h1 className="font-semibold text-2xl">Crear un Producto</h1>
                </div>
              </div>
            </Link>
          </>
        ) : (
          <></>
        )}
        {products.length === 0 ? (
          <>
            <p>No hay productos disponibles</p>
          </>
        ) : (
          products.map((pro) => (
            <div
              key={pro.id}
              className=" w-90 h-120 flex flex-col gap-2 rounded-lg bg-white text-sm shadow-[10px_15px_15px_rgba(0,0,0,.1)]  hover:scale-102  transition-transform duration-300"
            >
              <div className="w-full h-55 rounded-t-lg overflow-hidden">
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
                        className="w-full h-55 object-cover"
                      />
                    ) : (
                      <div className="w-full h-55 bg-[#3f0498]"></div>
                    );
                  })()
                ) : (
                  <div className="w-full h-55 bg-[#3f0498]"></div>
                )}
              </div>
              <div className="flex flex-col py-5 pr-5 gap-2 w-full p-10">
                <h1 className="text-xl font-semibold wrap-break-word">
                  {pro.name}
                </h1>

                <p className="">
                  <span className="font-semibold">Precio: </span>
                  {formatCOP(pro.price)}
                </p>
                <p className="">
                  <span className="font-semibold">Stock: </span> {pro.stock}
                </p>
                <p className=" pb-5">
                  <span className="font-semibold">Categoria: </span>
                  {pro.category.name}
                </p>
                <Link to={`/purchaseProduct/${pro.id}`}>
                  <button className="w-full  h-10 rounded-lg bg-[#3f0498] text-white">
                    Comprar
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}

        {/*tengo que poner una carta para crear productos*/}
      </div>
    </>
  );
}

export default ProductsCards;
