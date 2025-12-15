import axios from "axios";
import { useState, useEffect } from "react";
import { data, resolvePath, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";

function EditProducts() {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "",
    images: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: null });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("status", form.status);
      formData.append("CategoryId", form.CategoryId);

      if (files.length > 0) {
        formData.append("images", files[0]);
      }

      await axios.put(`/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Producto editado correctamente",
        icon: "success",
      }).then(() => navigate("/adminProducts"));
    } catch (error) {
      console.log("Error al editar el producto:", error);
    }
  };

  const fetchProduct = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.product ?? response.data;

    setForm({
      name: data.name || "",
      description: data.description || "",
      price: data.price || "",
      stock: data.stock || "",
      status: data.status || "",
      images: data.images || "",
    });

    setPreviewUrls([data.images]);

    setProduct(response.data.product);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

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

  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Quita los decimales
    }).format(value);
  };

  return (
  <>
    {/*main container*/}
    <div className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-30 py-6 sm:py-8 md:py-12 flex flex-col gap-6 sm:gap-8 md:gap-12">
      <h1 className="text-xl sm:text-2xl font-semibold">Editar producto</h1>
      
      {/*main content*/}
      <main className="w-full bg-white p-5 sm:p-8 md:p-10 rounded-lg flex flex-col lg:flex-row justify-center lg:justify-evenly gap-8 lg:gap-20">
        
        {/*card container - Vista previa*/}
        <article className="w-full lg:w-120 bg-gray-200 flex flex-col items-center justify-start gap-5 p-5 rounded-lg order-2 lg:order-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Vista previa</h1>
          
          {/*card*/}
          <div className="w-full max-w-90 bg-white flex flex-col rounded-lg gap-2">
            {/*img container*/}
            <div className="w-full h-60 sm:h-72 md:h-80 rounded-t-lg overflow-hidden">
              {previewUrls && previewUrls.length > 0 ? (
                <img
                  src={previewUrls[0]}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-sky-600"></div>
              )}
            </div>

            {/*text card container*/}
            <div className="w-full p-4 sm:p-5 flex flex-col gap-2 text-sm">
              <h1 className="text-lg sm:text-xl font-semibold break-words">
                {form.name || "Nombre del producto"}
              </h1>
              <h2 className="break-words text-sm">
                <span className="font-semibold">Descripción: </span>
                {form.description || "Sin descripción"}
              </h2>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Precio: </span>
                {form.price ? formatCOP(form.price) : "$0"}
              </p>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Stock: </span>
                {form.stock || "0"}
              </p>

              <button 
                type="button"
                className="w-full font-semibold text-sm h-10 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              >
                Ver info
              </button>
            </div>
          </div>
        </article>

        {/*Formulario de edición*/}
        <form
          onSubmit={updateProduct}
          className="w-full lg:w-120 bg-gray-200 py-5 px-5 sm:px-8 md:px-12 lg:px-15 rounded-lg flex flex-col gap-3 sm:gap-4 order-1 lg:order-2"
        >
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">Editando...</h1>
          
          {/* Upload de imagen */}
          <div className="w-full">
            <label
              htmlFor="images"
              className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-white hover:border-sky-500 transition-colors min-h-32"
            >
              {previewUrls && previewUrls.length > 0 ? (
                <div className="w-full flex gap-3 items-center justify-center">
                  <div className="relative">
                    <img
                      src={previewUrls[0]}
                      alt={form.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg shadow-sm"
                    />
                    <span className="absolute top-1 left-1 bg-white text-xs px-2 py-0.5 rounded shadow">
                      Imagen principal
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-gray-400"
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
                  <span className="font-medium text-sm sm:text-base text-center">
                    Haz clic o arrastra una imagen aquí
                  </span>
                </div>
              )}

              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // revoke old object URLs
                  previewUrls.forEach((u) => {
                    try {
                      URL.revokeObjectURL(u);
                    } catch (err) {}
                  });

                  const objectUrl = URL.createObjectURL(file);
                  setFiles([file]);
                  setPreviewUrls([objectUrl]);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Nombre */}
          <div className="w-full">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={form.name}
              placeholder="Nombre del producto"
              maxLength="55"
              className="w-full bg-white border border-gray-400 h-10 sm:h-12 rounded-lg px-4 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="w-full">
            <textarea
              name="description"
              onChange={handleChange}
              value={form.description}
              placeholder="Descripción del producto"
              maxLength="250"
              rows="4"
              className="w-full bg-white border border-gray-400 rounded-lg px-4 sm:px-5 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Precio y Stock en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                value={form.price}
                placeholder="Precio"
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
                className="w-full bg-white border border-gray-400 h-10 sm:h-12 rounded-lg px-4 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {errors.price && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                name="stock"
                onChange={handleChange}
                value={form.stock}
                placeholder="Stock"
                onInput={(e) => {
                  if (e.target.value.length > 4) {
                    e.target.value = e.target.value.slice(0, 4);
                  }
                }}
                className="w-full bg-white border border-gray-400 h-10 sm:h-12 rounded-lg px-4 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Categoría */}
          <div className="w-full">
            <select
              name="CategoryId"
              onChange={handleChange}
              value={form.CategoryId}
              className="bg-white border border-gray-400 text-gray-500 h-10 sm:h-12 w-full rounded-lg px-4 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.length === 0 ? (
                <option value="" disabled>No hay categorías</option>
              ) : (
                categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {errors.CategoryId && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.CategoryId}</p>
            )}
          </div>

          {/* Estado */}
          <div className="w-full">
            <select
              name="status"
              onChange={handleChange}
              value={form.status}
              className="bg-white border border-gray-400 text-gray-500 h-10 sm:h-12 w-full rounded-lg px-4 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Seleccionar estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Error general */}
          {errors._general && (
            <p className="text-red-500 text-xs sm:text-sm text-center">{errors._general}</p>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            className="w-full bg-sky-600 text-white font-semibold h-11 sm:h-12 rounded-lg text-sm sm:text-base hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 mt-2"
          >
            Confirmar edición
          </button>
        </form>
      </main>
    </div>
  </>
);
}
export default EditProducts;
