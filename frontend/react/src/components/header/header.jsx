import logo from "../../assets/logoParche.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/authService";
import { Search } from "lucide-react";
import { useState } from "react";
function Header() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload;
  };
  return (
    <>
      <nav className="w-full h-20 bg-sky-600 flex flex-row items-center px-20 justify-between animate-slide-in-top animate-duration-400">
        <Link to="/">
          <img
            src={logo}
            alt="logo ParcheMarket"
            className="w-15 rounded-full"
          />
        </Link>
        {/*si el usuario no está registrado*/}
        <div className="flex flex-row gap-10">
          <div className=" flex flex-row  ">
            <input
              type="text"
              className="bg-white h-10 rounded-l-4xl w-80 px-5"
              placeholder="Buscar"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-white h-10 rounded-r-4xl pr-5"
              onClick={() => {
                if (!search.trim()) return;
                navigate(`/?search=${encodeURIComponent(search)}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  navigate(`/?search=${encodeURIComponent(search)}`);
                }
              }}
            >
              <Search />
            </button>
          </div>
          {!isAuthenticated ? (
            <>
              {/*botones*/}
              <div className="flex flex-row gap-10">
                <Link to={"/login"}>
                  <button
                    id="login"
                    className="w-35 h-10 border border-white rounded-4xl text-white"
                  >
                    Iniciar Sesión
                  </button>
                </Link>

                <Link to={"/register"}>
                  <button
                    id="singin"
                    className="w-35 h-10  rounded-4xl text-sky-600  bg-white"
                  >
                    Registrarse
                  </button>
                </Link>
              </div>
            </>
          ) : isAdmin ? (
            <>
              {/*botones*/}
              <div className="flex flex-row gap-10 items-center">
                <h2 className="font-semibold text-white">
                  ¡Bienvenido! {user?.name}
                </h2>
                <Link to={"/panelAdmin"}>
                  <button className="w-50 h-10  rounded-4xl  text-sky-600 bg-white ">
                    Panel Administrativo
                  </button>
                </Link>
                <Link to={"/perfil"}>
                  <button className="w-35 h-10  rounded-4xl text-white border border-white">
                    Perfil
                  </button>
                </Link>
                <button
                  className="w-35 h-10  rounded-4xl text-white  bg-red-600"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              {/*botones*/}
              <div className="flex flex-row gap-10 items-center">
                <h2 className="font-semibold text-white">
                  ¡Bienvenido! {user?.name}
                </h2>
                <Link to={"/perfil"}>
                  <button className="w-35 h-10  rounded-4xl text-sky-600  bg-white">
                    Perfil
                  </button>
                </Link>

                <button
                  className="w-35 h-10  rounded-4xl text-white  bg-red-600"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;
