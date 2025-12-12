import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    CategoryId: "",
  });

  const [errors, setErrors] = useState({});
  const [products, setproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/products",
        {
          name: form.name,
          description: form.description,
          price: form.price,
          stock: form.stock,
          CategoryId: form.CategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Producto Creado ",
        icon: "success",
      }).then(() => {
        navigate("/adminProducts");
      });
    } catch (error) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: error,
      });
    }
  };

  //se traen las categorias para poder asociar el producto a una categoria
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.categories);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-10 items-center px-20 py-15">
      <h1 className="text-2xl font-semibold">Crear Producto</h1>
      <div className="w-full bg-white flex gap-20 p-10 rounded-lg">
        <div className="w-200 h-100 bg-gray-200 flex flex-col gap-5 p-5 rounded-lg">
          <h1 className="text-xl font-semibold">Vista previa</h1>

          <div className="w-full h-80 bg-white flex rounded-lg gap-5">
            <div className="w-4/12 h-full bg-[#3f0498] rounded-l-lg"></div>
            <div className="w-3/5 py-5 flex flex-col gap-2 text-sm">
              <h1 className="text-xl font-semibold wrap-break-word">
                {form.name}
              </h1>
              <h2 className="w-100 wrap-break-word  ">
                <span className="font-semibold">Descripción: </span>
                {form.description}
              </h2>
              <p className="text-lg">
                <span className="font-semibold">Precio: </span>
                {form.price} COP$
              </p>
              <p className="text-lg">
                <span className="font-semibold">Stock: </span>
                {form.stock}
              </p>

              <button className="w-full font-semibold text-sm  h-10 rounded-lg bg-[#3f0498] text-white">
                Comprar
              </button>
            </div>
          </div>
        </div>
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-120 h-full bg-gray-200 p-18 rounded-lg flex grid-cols-2 gap-2 flex-col "
        >
          <div className="w-full h-40 bg-[#3f0498] rounded-lg"></div>
          <input
            type="text"
            name="name"
            maxLength="55"
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="bg-white border border-gray-400 h-10 rounded-lg px-5"
          />
          <textarea
            name="description"
            placeholder="Descripción"
            maxLength="250"
            onChange={handleChange}
            id=""
            className="bg-white border border-gray-400 h-10 rounded-lg px-5"
          ></textarea>
          {/* <div className="w-full flex justify-between"> */}
          <input
            type="number"
            onChange={handleChange}
            placeholder="precio"
            name="price"
            maxLength="10"
            className="bg-white border border-gray-400 h-10  rounded-lg px-5"
          />
          <input
            type="number"
            name="stock"
            placeholder="stock"
            onChange={handleChange}
            className="bg-white border border-gray-400 h-10  rounded-lg px-5"
          />
          {/* </div> */}
          <select
            name="CategoryId"
            id=""
            onChange={handleChange}
            className="bg-white border border-gray-400 text-gray-500 h-10 rounded-lg px-5"
          >
            <option value="">categoria</option>
            {categories.length === 0 ? (
              <option value="">No hay categorias</option>
            ) : (
              categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          <button className="w-full bg-[#3f0498] text-white font-semibold  h-12 rounded-lg">
            Crear producto
          </button>{" "}
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
