import logo from "../../assets/parcheMarketLogo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <nav className="w-full h-20 bg-[#006e18] flex flex-row items-center px-20 justify-between">
        <img src={logo} alt="" className="w-15 rounded-full" />
        {/*si el usuario no está registrado*/}
        <div className="flex flex-row gap-10">
          <input
            type="text"
            className="bg-white h-10 rounded-lg w-70 px-5"
            placeholder="Buscar"
          />
          {/*botones*/}
          <div id="buttons" className="flex flex-row gap-10">
            <Link to={"/login"}>
              <button
                id="login"
                className="w-35 h-10 border border-white rounded-lg text-white"
              >
                Iniciar Sesión
              </button>
            </Link>

            <Link to={"/register"}>
              <button
                id="singin"
                className="w-35 h-10  rounded-lg text-[#006e18]  bg-white"
              >
                Registrarse
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
