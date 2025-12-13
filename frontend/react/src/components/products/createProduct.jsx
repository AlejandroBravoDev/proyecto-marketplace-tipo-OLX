import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function CreateProduct() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if(!isAdmin){
    navigate("/")
  }else if (!isAuthenticated){
    navigate("/login")
  }
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    CategoryId: "",
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

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

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("CategoryId", form.CategoryId);

      // agregar archivos
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post("/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Producto Creado ",
        icon: "success",
      }).then(() => {
        navigate("/adminProducts");
      });
    } catch (error) {
      console.log("Error response:", error.response?.data);

      if (error.response?.data?.errors) {
        const formatted = {};
        error.response.data.errors.forEach((err) => {
          // express-validator may return `param` or `path`
          const key = err.param || err.path || "_general";
          formatted[key] = err.msg;
        });
        setErrors(formatted);
      } else if (error.response?.data?.msg) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: error.response.data.msg,
        });
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error al crear producto",
        });
      }
    }
  };

  //se traen las categorias para poder asociar el producto a una categoria
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/categories/active", {
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

  useEffect(() => {
    // generar URLs de preview para los archivos seleccionados
    if (!files || files.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Quita los decimales
    }).format(value);
  };

  return (
    //super main container
    <div className="w-full h-full flex flex-col gap-10 items-center px-20 py-15">
      <h1 className="text-2xl font-semibold">Crear Producto</h1>
      {/*main container*/}
      <div className="w-full bg-white flex justify-evenly gap-20 p-10 rounded-lg">
        <div className="w-120  bg-gray-200 flex flex-col items-center justify-center gap-5 p-5 rounded-lg">
          <h1 className="text-xl font-semibold">Vista previa</h1>

          {/*Card*/}
          <div className="w-80 bg-white flex flex-col rounded-lg gap-2">
            {/*imagen container*/}
            <div className="w-full h-full rounded-t-lg overflow-hidden">
              {previewUrls && previewUrls.length > 0 ? (
                <img
                  src={previewUrls[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#3f0498]"></div>
              )}
            </div>

            {/*text container*/}
            <div className="w-full p-5 flex flex-col gap-2 text-sm">
              <h1 className="text-xl font-semibold wrap-break-word">
                {form.name}
              </h1>
              <h2 className=" wrap-break-word  ">
                <span className="font-semibold">Descripción: </span>
                {form.description}
              </h2>
              <p className="text-lg">
                <span className="font-semibold">Precio: </span>
                {formatCOP(form.price)}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Stock: </span>
                {form.stock}
              </p>

              <button className="w-full font-semibold text-sm  h-10 rounded-lg bg-[#3f0498] text-white">
                Ver info
              </button>
            </div>
          </div>
        </div>
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-120 h-full bg-gray-200 p-18 rounded-lg flex grid-cols-2 gap-2 flex-col "
        >
          <div>
            <label
              htmlFor="images"
              className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-indigo-500 transition-colors"
            >
              {previewUrls && previewUrls.length > 0 ? (
                <div className="w-full flex gap-3 items-center justify-start overflow-x-auto">
                  {previewUrls.slice(0, 6).map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt={`preview-${i}`}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4 4 4m6 8v-8m0 0l4 4m-4-4-4 4"
                    />
                  </svg>
                  <span className="font-medium">
                    Haz click o arrastra archivos aquí
                  </span>
                </div>
              )}

              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.files).slice(0, 6);
                  setFiles(selected);
                }}
                className="hidden"
              />
            </label>
          </div>
          <input
            type="text"
            name="name"
            maxLength="55"
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="bg-white border border-gray-400 h-10 rounded-lg px-5"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
          <textarea
            name="description"
            placeholder="Descripción"
            maxLength="250"
            onChange={handleChange}
            id=""
            className="bg-white border border-gray-400 h-10 rounded-lg px-5 "
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          {/* <div className="w-full flex justify-between"> */}
          <input
            type="number"
            onChange={handleChange}
            placeholder="precio"
            name="price"
            onInput={(e) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
            className="bg-white border border-gray-400 h-10  rounded-lg px-5"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
          <input
            type="number"
            name="stock"
            placeholder="stock"
            onInput={(e) => {
              if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
              }
            }}
            onChange={handleChange}
            className="bg-white border border-gray-400 h-10  rounded-lg px-5"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
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
          {errors.CategoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.CategoryId}</p>
          )}
          <button className="w-full bg-[#3f0498] text-white font-semibold  h-12 rounded-lg">
            Crear producto
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
