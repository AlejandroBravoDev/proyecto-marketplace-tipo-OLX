//este va a ser el componente del index
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

function ProductsCards() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products/active");
      setProducts(response.data.products);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      <div className="w-full flex gap-10 flex-wrap py-10 px-20 grid-cols-4 items-center justify-center">
        {products.length === 0 ? (
          <>
            <p>no tienes productos</p>{" "}
            <Link to={"/"}>
              <h1>Crear</h1>
            </Link>{" "}
          </>
        ) : (
          products.map((pro) => (
            <div
              key={pro.id}
              className=" w-90 h-120 flex flex-col gap-2 rounded-lg bg-white text-sm shadow-[10px_15px_15px_rgba(0,0,0,.1)] "
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
                        src={url}
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
                <button className="w-full  h-10 rounded-lg bg-[#3f0498] text-white">
                  Comprar
                </button>
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
