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
    fetchProducts()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-full flex gap-10 flex-wrap py-10 px-20">
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
              className=" flex-1 flex gap-5 rounded-lg bg-white text-sm"
            >
              <div className="w-60 h-full bg-[#3f0498] rounded-l-lg"></div>
              <div className="flex flex-col py-5 gap-2">
                <h1 className="text-xl font-semibold wrap-break-word">
                  {pro.name}
                </h1>
                <p className="w-100 wrap-break-word">
                  <span className="font-semibold">Descripción: </span>
                  {pro.description}
                </p>
                <p className="">
                  <span className="font-semibold">Precio: </span>
                  {pro.price}
                </p>
                <p className="">
                  <span className="font-semibold">Stock: </span> {pro.stock}
                </p>
                <p className=" pb-5">
                  <span className="font-semibold">Categoria: </span>
                  {pro.category.name}
                </p>
                <div className="w-full flex gap-6 ">
                  <Link to={"/editProduct"}>
                    <button className="w-30  h-8 rounded-lg bg-[#3f0498] text-white">
                      Editar
                    </button>
                  </Link>
                  <button onClick={() => deleteProduct(pro)} className="w-30  h-8 rounded-lg bg-red-500 text-white">
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
