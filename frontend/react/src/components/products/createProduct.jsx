import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function CreateProduct() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/");
  } else if (!isAuthenticated) {
    navigate("/login");
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

  const [products, setproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({});
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

      const responseErrors = error.response?.data;

      if (responseErrors) {
        if (error.response.status === 400 && responseErrors.errors) {
          const newErrors = {};
          responseErrors.errors.forEach((err) => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);

          Swal.fire({
            icon: "error",
            title: "Error de Validación",
            text: "Revisa los campos del formulario.",
          });
        } else if (responseErrors.msg) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: responseErrors.msg,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el servidor",
          text: "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    } finally {
      setLoading(false);
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
    // super main container
    <div className="w-full h-full flex flex-col gap-5 md:gap-10 items-center px-5 md:px-10 py-8 md:py-15">
      <h1 className="text-2xl font-semibold">Crear Producto</h1>

      {/* main container (Responsive: Se apila en móvil, 2 columnas en desktop) */}
      <div className="w-full bg-white flex flex-col lg:flex-row lg:justify-center gap-8 lg:gap-20 p-5 md:p-10 rounded-lg shadow-lg">
        {/* Contenedor de Vista Previa */}
        <div className="w-full lg:w-1/3 xl:w-120 bg-gray-200 flex flex-col items-center justify-start gap-4 p-4 rounded-lg order-2 lg:order-1">
          <h1 className="text-xl font-semibold">Vista previa</h1>

          {/* Card */}
          <div className="w-full max-w-sm bg-white flex flex-col rounded-lg gap-2 shadow-md">
            {/* imagen container */}
            <div className="w-full h-40 md:h-60 rounded-t-lg overflow-hidden">
              {previewUrls && previewUrls.length > 0 ? (
                <img
                  src={previewUrls[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-sky-600 flex items-center justify-center text-white">
                  Sin imagen
                </div>
              )}
            </div>

            {/* text container */}
            <div className="w-full p-4 flex flex-col gap-2 text-sm">
              <h1 className="text-xl font-semibold break-words">
                {form.name || "Nombre Producto"}
              </h1>
              <h2 className="break-words">
                <span className="font-semibold">Descripción: </span>
                {form.description || "Descripción del producto..."}
              </h2>
              <p className="text-lg">
                <span className="font-semibold">Precio: </span>
                {formatCOP(form.price || 0)}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Stock: </span>
                {form.stock || 0}
              </p>

              <button className="w-full font-semibold text-sm h-10 rounded-lg bg-sky-600 text-white mt-2 hover:bg-sky-700 transition-colors">
                Ver info
              </button>
            </div>
          </div>
        </div>

        {/* Contenedor del Formulario */}
        <form
          action=""
          onSubmit={handleSubmit}
          // Responsive: Ocupa todo el ancho en móvil, 2/3 o 1/2 en desktop
          className="w-full lg:w-2/3 xl:w-120 bg-gray-200 p-5 md:p-8 rounded-lg flex flex-col gap-4 order-1 lg:order-2"
        >
          {/* Selector de Imágenes */}
          <div>
            <label
              htmlFor="images"
              className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-indigo-500 transition-colors"
            >
              {previewUrls && previewUrls.length > 0 ? (
                <div className="w-full flex gap-3 items-center justify-start overflow-x-auto p-1">
                  {previewUrls.slice(0, 6).map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt={`preview-${i}`}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-sm flex-shrink-0"
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
                  <span className="font-medium text-center">
                    Haz click o arrastra archivos aquí (Máx 6)
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

          {/* Campos de texto y selección */}
          <input
            type="text"
            name="name"
            maxLength="55"
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="bg-white border border-gray-400 h-10 rounded-lg px-5 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-[-10px]">{errors.name}</p>
          )}

          <textarea
            name="description"
            placeholder="Descripción"
            maxLength="250"
            onChange={handleChange}
            id=""
            className="bg-white border border-gray-400 h-20 md:h-24 rounded-lg p-3 resize-none focus:ring-sky-500 focus:border-sky-500"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-[-10px]">
              {errors.description}
            </p>
          )}

          {/* Contenedor para Precio y Stock (Horizontal en móvil) */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                type="number"
                onChange={handleChange}
                placeholder="Precio"
                name="price"
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
                className="bg-white border border-gray-400 h-10 w-full rounded-lg px-5 focus:ring-sky-500 focus:border-sky-500"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="w-1/2">
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                onInput={(e) => {
                  if (e.target.value.length > 4) {
                    e.target.value = e.target.value.slice(0, 4);
                  }
                }}
                onChange={handleChange}
                className="bg-white border border-gray-400 h-10 w-full rounded-lg px-5 focus:ring-sky-500 focus:border-sky-500"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          <select
            name="CategoryId"
            id=""
            onChange={handleChange}
            className="bg-white border border-gray-400 text-gray-500 h-10 rounded-lg px-5 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Categoría</option>
            {categories.length === 0 ? (
              <option value="" disabled>
                No hay categorías
              </option>
            ) : (
              categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          {errors.CategoryId && (
            <p className="text-red-500 text-sm mt-[-10px]">
              {errors.CategoryId}
            </p>
          )}

          <button className="w-full bg-sky-600 text-white font-semibold h-12 rounded-lg mt-2 hover:bg-sky-700 transition-colors">
            Crear producto
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
