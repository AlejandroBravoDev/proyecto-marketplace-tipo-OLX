import Header from "../components/header/header";
import CategoriesNav from "../components/header/categoriesNav";
import ProductsCards from "../components/products/products"; 
function Index() {
  return (
    <>
      <Header />
      <CategoriesNav/>
      <ProductsCards/>
    </>
  );
}

export default Index;
