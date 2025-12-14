import { Link } from "react-router-dom";
function PanelAdmin() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center gap-20 py-15 px-20 ">
        <h1 className="text-2xl font-semibold">Panel Admin</h1>
        <main className="w-full flex px-20 justify-evenly items-center">
          <Link to="/adminProducts">
            <div className="w-80 h-90 bg-white rounded-lg flex flex-col justify-center items-center" >Productos</div>
          </Link>
          <Link to="/adminCategories">
          <div className="w-80 h-90 bg-white rounded-lg flex flex-col justify-center items-center">categorias</div>
          </Link>
        </main>
      </div>
    </>
  );
}

export default PanelAdmin;
