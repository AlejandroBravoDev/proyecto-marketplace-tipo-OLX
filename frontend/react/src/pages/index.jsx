import Header from "../components/header/header";
import CategoriesNav from "../components/header/categoriesNav";
import ProductsCards from "../components/products/products";
import Swal from "sweetalert2";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Index() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();


  const search = searchParams.get("search");
  const fetchProducts = async () => {
    const response = await axios.get("/api/products/active", {
      params: {
        search,
      },
    });
    setProducts(response.data.products);
    console.log("productos:", response.data);
  };

  const fetchProductsByCategory = async (categoryId) => {
    const response = await axios.get(
      `/api/products/active?category=${categoryId}`
    );
    setProducts(response.data.products);
    console.log(response.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);
  return (
    <>
      <Header />
      <CategoriesNav onSelectCategory={fetchProductsByCategory} />
      <ProductsCards products={products} />
    </>
  );
}

export default Index;
