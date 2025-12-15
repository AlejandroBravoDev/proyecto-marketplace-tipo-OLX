import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function PurchaseProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState(1);  
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "",
    images: "",
    category: "",
  });
  const [previewUrls, setPreviewUrls] = useState([]);

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
      category: data.categoryId || "",
    });

    setPreviewUrls([data.images]);

    setProduct(response.data.product);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/cart",
        {
          productId: product.id,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Producto agregado al carrito",
        icon: "success"
      })
    } catch (error) {
      alert(error.response?.data?.msg || "Error al agregar al carrito");
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
    <div className="w-full min-h-screen py-6 sm:py-10 md:py-15 px-4 sm:px-8 md:px-12 lg:px-20">
      <main className="w-full bg-white p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 rounded-lg animate-fade-in animate-duration-400">
        
        {/* Imagen y descripción del producto */}
        <div className="w-full lg:w-4/6 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
          {/* Imagen */}
          <div className="w-full md:w-auto shrink-0">
            <img
              src={form.images}
              className="w-full md:w-65 lg:w-70 xl:w-80 rounded-lg object-cover shadow-md"
              alt={form.name || "imagen del producto"}
            />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 py-0 md:py-6 lg:py-10 justify-start md:justify-center flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold wrap-break-word">
              {form.name}
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-600">
              {formatCOP(form.price)}
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 wrap-break-word">
                {form.description}
              </p>
              {form.categoryId && (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Categoría:</span> {form.categoryId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Panel de compra */}
        <div className="w-full lg:w-4/12 p-5 sm:p-6 md:p-8 lg:p-10 rounded-lg border-2 border-gray-300 flex flex-col gap-4 sm:gap-5 text-base sm:text-lg lg:sticky lg:top-20 self-start">
          {/* Stock disponible */}
          <div className="flex flex-col gap-2">
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span className="font-semibold text-gray-700">Stock disponible:</span>
              <span className={`font-bold text-xl ${form.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {form.stock}
              </span>
            </p>
            {form.stock === 0 && (
              <p className="text-sm text-red-600 font-medium">
                Producto agotado
              </p>
            )}
          </div>

          {/* Input de cantidad */}
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-sm font-semibold text-gray-700">
              Cantidad
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              min={1}
              value={amount}
              onChange={(e) => {
                const value = Math.max(1, Math.min(form.stock, Number(e.target.value)));
                setAmount(value);
              }}
              max={form.stock}
              disabled={form.stock === 0}
              placeholder={form.stock > 0 ? `Máximo ${form.stock}` : 'Sin stock'}
              className="w-full h-11 sm:h-12 rounded-lg px-4 border-2 border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
            />
            {form.stock > 0 && form.stock <= 5 && (
              <p className="text-xs sm:text-sm text-orange-600">
                ¡Solo quedan {form.stock} unidades!
              </p>
            )}
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={form.stock === 0}
            className="w-full h-11 sm:h-12 border-2 border-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sky-600 font-semibold transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {form.stock > 0 ? 'Agregar al carrito' : 'Producto no disponible'}
          </button>

          {/* Información adicional */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Envío disponible
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Compra segura
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </>
);
}

export default PurchaseProduct;
