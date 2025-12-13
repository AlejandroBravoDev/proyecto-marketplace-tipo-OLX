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
      <div className="w-full flex gap-10 flex-wrap py-10 px-20 justify-center">
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
              className=" w-90  h-120   flex flex-col gap-2 rounded-lg bg-white text-sm shadow-[10px_15px_15px_rgba(0,0,0,.1)] "
            >
              <div className="w-full h-60 rounded-t-lg overflow-hidden">
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
                        className="w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 bg-[#3f0498]"></div>
                    );
                  })()
                ) : (
                  <div className="w-full h-60 bg-[#3f0498]"></div>
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
                <div className="w-full flex gap-6 ">
                  <Link to={`/editProduct/${pro.id}`}>
                    <button className="w-30  h-8 rounded-lg bg-[#3f0498] text-white">
                      Editar
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteProduct(pro)}
                    className="w-30  h-8 rounded-lg bg-red-500 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/*tengo que poner una carta para crear productos*/}
      </div>
    </>
  );
}

export default AdminProductsCards;
