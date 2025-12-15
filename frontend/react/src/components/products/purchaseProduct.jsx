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
      <div className="w-full h-full py-15 px-20">
        <main className="w-full h-full p-10 flex flex-row gap-10 bg-white rounded-lg">
          {/*imagen y comentarios del producto*/}
          <div className="w-4/6 h-full flex flex-row gap-10">
            <img
              src={form.images}
              className="w-65 rounded-lg"
              alt="imagen del producto"
            />

            <div className="flex flex-col gap-5 py-10 justify-center">
              <h1 className="text-2xl font-semibold">{form.name}</h1>
              <p className="text-3xl font-medium text-sky-600">
                {formatCOP(form.price)}
              </p>
              <p className="text-lg ">{form.description}</p>
              <p>{form.categoryId}</p>
            </div>
          </div>

          {/*info de stock y botón para agregar al carrito */}
          <div className="w-4/12 h-full p-10 rounded-lg border border-gray-300 flex flex-col gap-5 text-lg">
            <p className="text-lg flex  gap-2 text-sky-700">
              <span className="text-xl ">Stock disponible </span>
              {form.stock}
            </p>
            <input
              type="number"
              name="amount"
              min={1}
              value={amount}
              onChange={(e) =>
                setAmount(Math.min(form.stock, Number(e.target.value)))
              }
              max={form.stock}
              placeholder={`cantidad (solo hay ${form.stock} disponibles)`}
              className="w-full h-10 rounded-2xl pl-5 border border-sky-600 focus:border-sky-600"
            />

            <button
              onClick={handleAddToCart}
              className="w-full h-10 border border-sky-600 bg-[#E3EDFB] rounded-2xl text-sky-600"
            >
              Agregar al carrito
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default PurchaseProduct;
