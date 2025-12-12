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
              <div className="flex flex-col py-5 pr-5 gap-2 w-full">
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
                {!isAuthenticated ? (
                  <>
                    <Link to={"/login"}>
                      <button className="w-full  h-10 rounded-lg bg-[#3f0498] text-white">
                        Comprar
                      </button>
                    </Link>
                  </>
                ) : isAdmin ? (
                  <>
                    <div className="w-full flex gap-6 ">
                      <Link to={"/editProduct"}>
                        <button className="w-35  h-10 rounded-lg bg-[#3f0498] text-white">
                          Editar
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteProduct(pro)}
                        className="w-35 h-10 rounded-lg bg-red-500 text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button className="w-full  h-10 rounded-lg bg-[#3f0498] text-white">
                      Comprar
                    </button>
                  </>
                )}
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
