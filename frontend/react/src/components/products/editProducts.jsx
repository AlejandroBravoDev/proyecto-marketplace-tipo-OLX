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
      <div className="w-full h-dvh px-30 py-12 flex flex-col gap-12">
        <h1 className="text-2xl font-semibold ">Editar producto</h1>
        {/*main content*/}
        <main className="w-full bg-white p-10 rounded-lg justify-evenly gap-20 flex">
          {/*card container*/}
          <article className="w-120  bg-gray-200 flex flex-col items-center justify-center gap-5 p-5 rounded-lg">
            <h1 className="text-2xl font-semibold ">Vista previa</h1>
            {/*card*/}
            <div className="w-90 h-120 bg-white flex flex-col rounded-lg gap-2">
              {/*img container*/}
              <div className="w-full h-full rounded-t-lg overflow-hidden ">
                {previewUrls && previewUrls.length > 0 ? (
                  <img
                    src={previewUrls[0]}
                    alt={form.name}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-sky-600"></div>
                )}
              </div>

              {/*text card container*/}
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

                <button className="w-full font-semibold text-sm  h-10 rounded-lg bg-sky-600 text-white">
                  Ver info
                </button>
              </div>
            </div>
          </article>

          <form
            action="post"
            onSubmit={updateProduct}
            className="w-120 h-full bg-gray-200 py-5 px-15 rounded-lg flex items-center gap-3 flex-col "
          >
            <h1 className="text-2xl font-semibold ">Editando...</h1>
            <div className="w-full">
              <label
                htmlFor="images"
                className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:border-indigo-500 transition-colors"
              >
                {previewUrls && previewUrls.length > 0 ? (
                  <div className="w-full flex gap-3 items-center justify-start overflow-x-auto">
                    <div className="relative">
                      <img
                        src={previewUrls[0]}
                        alt={form.name}
                        className="w-40 h-40 object-cover rounded-lg shadow-sm"
                      />
                      <span className="absolute top-1 left-1 bg-white text-xs px-2 py-0.5 rounded">
                        Imagen principal
                      </span>
                    </div>
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
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
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

            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={form.name}
              placeholder="Nombre del producto"
              className="w-full bg-white border border-gray-400 h-10 rounded-lg px-5"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={form.description}
              placeholder="Nombre del producto"
              className="w-full bg-white border border-gray-400 h-10 rounded-lg px-5"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <input
              type="text"
              name="price"
              onChange={handleChange}
              value={form.price}
              placeholder="Nombre del producto"
              className="w-full bg-white border border-gray-400 h-10 rounded-lg px-5"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
            <input
              type="text"
              name="stock"
              onChange={handleChange}
              value={form.stock}
              placeholder="Nombre del producto"
              className="w-full bg-white border border-gray-400 h-10 rounded-lg px-5"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}

            <select
              name="CategoryId"
              id=""
              onChange={handleChange}
              className="bg-white border border-gray-400 text-gray-500 h-10 w-full rounded-lg px-5"
            >
              <option value={form.CategoryId}>no camia</option>
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
            {errors._general && (
              <p className="text-red-500 text-sm mt-2">{errors._general}</p>
            )}

            <select
              name="status"
              id=""
              onChange={handleChange}
              className="bg-white border border-gray-400 text-gray-500 h-10 w-full rounded-lg px-5"
            >
              <option value="">{form.status}</option>
              <option value="inactivo">Inactivo</option>
              <option value="activo">Activo</option>
            </select>
            <button
              type="submit"
              className="w-full bg-sky-600 text-white font-semibold  h-12 rounded-lg"
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
