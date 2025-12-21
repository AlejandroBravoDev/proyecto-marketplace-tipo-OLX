import logo from "../../assets/logoParche.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/authService";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

function Header() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartId, setCartId] = useState(null);

  // Obtener el carrito del usuario
 // En el useEffect del Header
useEffect(() => {
  const fetchCart = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch("/api/cart/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('Response status:', response.status); 

      if (response.ok) {
        const data = await response.json();
        console.log('Cart data:', data); 
        setCartId(data.id);
        const totalItems = data.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
        setCartItemsCount(totalItems);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  fetchCart();
}, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  const handleSelectChange = (e) => {
    const ruta = e.target.value;
    if (ruta) {
      navigate(ruta);
    }
  };

  const handleCartClick = () => {
    if (cartId) {
      navigate(`/cart/${cartId}`);
    } else {
      // Si no hay cartId, intenta obtenerlo primero o navega a /cart
      navigate("/cart");
    }
  };

  return (
    <>
      <nav className="w-full bg-white animate-slide-in-top animate-duration-400">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex h-20 items-center px-6 xl:px-20 justify-between">
          <Link to="/">
            <h2 className="text-xl xl:text-2xl font-bold text-sky-600">
              ParcheMarket
            </h2>
          </Link>

          <div className="flex flex-row gap-4 xl:gap-10 items-center">
            {/* Buscador */}
            <div className="flex flex-row border border-sky-600 rounded-4xl">
              <input
                type="text"
                className="bg-white h-10 rounded-l-4xl w-60 xl:w-80 px-5 text-sm focus:outline-none"
                placeholder="Buscar"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    navigate(`/?search=${encodeURIComponent(search)}`);
                  }
                }}
              />
              <button
                className="bg-white h-10 rounded-r-4xl pr-5 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  if (!search.trim()) return;
                  navigate(`/?search=${encodeURIComponent(search)}`);
                }}
              >
                <Search />
              </button>
            </div>

            {/* Carrito - Solo para usuarios autenticados y no admin */}
            {isAuthenticated && !isAdmin && (
              <button
                onClick={handleCartClick}
                className="relative p-2 text-white hover:bg-sky-700 rounded-full transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Botones según estado de autenticación */}
            {!isAuthenticated ? (
              <div className="flex flex-row gap-4 xl:gap-10">
                <Link to={"/login"}>
                  <button className="w-32 xl:w-35 h-10 border border-white rounded-4xl text-white hover:bg-sky-700 transition-colors text-sm xl:text-base">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to={"/register"}>
                  <button className="w-32 xl:w-35 h-10 rounded-4xl text-sky-600 bg-white hover:bg-gray-100 transition-colors text-sm xl:text-base">
                    Registrarse
                  </button>
                </Link>
              </div>
            ) : isAdmin ? (
              <div className="flex flex-row gap-4 xl:gap-10 items-center">
                <h2 className="font-semibold text-white text-sm xl:text-base">
                  ¡Bienvenido!{" "}
                  <span className="text-[#1d007c]">{user?.name}</span>
                </h2>
                <select
                  onChange={handleSelectChange}
                  className="text-white bg-sky-600 rounded-4xl border border-white h-10 w-36 xl:w-40 px-4 text-sm xl:text-base focus:outline-none hover:bg-sky-700 transition-colors"
                >
                  <option value="/">Admin</option>
                  <option value="/adminProducts">Productos</option>
                  <option value="/adminCategories">Categorías</option>
                  <option value="/myOrders">Órdenes</option>
                </select>
                <button
                  className="w-32 xl:w-35 h-10 rounded-4xl text-white bg-red-600 hover:bg-red-700 transition-colors text-sm xl:text-base"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-4 xl:gap-10 items-center">
                <h2 className="font-semibold text-white text-sm xl:text-base">
                  ¡Bienvenido! {user?.name}
                </h2>
                <Link to={"/perfil"}>
                  <button className="w-32 xl:w-35 h-10 rounded-4xl text-sky-600 bg-white hover:bg-gray-100 transition-colors text-sm xl:text-base">
                    Perfil
                  </button>
                </Link>
                <button
                  className="w-32 xl:w-35 h-10 rounded-4xl text-white bg-red-600 hover:bg-red-700 transition-colors text-sm xl:text-base"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="lg:hidden">
          <div className="flex h-16 items-center px-4 justify-between">
            <Link to="/">
              <h2 className="text-lg font-bold text-white">
                Parche <span className="text-[#1d007c]">Market</span>
              </h2>
            </Link>

            <div className="flex items-center gap-3">
              {/* Carrito móvil - Solo para usuarios autenticados y no admin */}
              {isAuthenticated && !isAdmin && (
                <button
                  onClick={handleCartClick}
                  className="relative p-2 text-white"
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="bg-sky-700 px-4 py-4 flex flex-col gap-4">
              {/* Buscador móvil */}
              <div className="flex flex-row w-full">
                <input
                  type="text"
                  className="bg-white h-10 rounded-l-lg flex-1 px-4 text-sm focus:outline-none"
                  placeholder="Buscar"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      navigate(`/?search=${encodeURIComponent(search)}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                />
                <button
                  className="bg-white h-10 rounded-r-lg px-4 hover:bg-gray-100"
                  onClick={() => {
                    if (!search.trim()) return;
                    navigate(`/?search=${encodeURIComponent(search)}`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Search size={20} />
                </button>
              </div>

              {!isAuthenticated ? (
                <>
                  <Link to={"/login"} className="w-full">
                    <button className="w-full h-10 border border-white rounded-lg text-white hover:bg-sky-600 transition-colors">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link to={"/register"} className="w-full">
                    <button className="w-full h-10 rounded-lg text-sky-600 bg-white hover:bg-gray-100 transition-colors">
                      Registrarse
                    </button>
                  </Link>
                </>
              ) : isAdmin ? (
                <>
                  <div className="text-white text-center py-2">
                    ¡Bienvenido!{" "}
                    <span className="text-[#1d007c] font-semibold">
                      {user?.name}
                    </span>
                  </div>
                  <select
                    onChange={(e) => {
                      handleSelectChange(e);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-white bg-sky-600 rounded-lg border border-white h-10 px-4 focus:outline-none"
                  >
                    <option value="/">Admin</option>
                    <option value="/adminProducts">Productos</option>
                    <option value="/adminCategories">Categorías</option>
                    <option value="/myOrders">Órdenes</option>
                  </select>
                  <button
                    className="w-full h-10 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <div className="text-white text-center py-2">
                    ¡Bienvenido!{" "}
                    <span className="font-semibold">{user?.name}</span>
                  </div>
                  <Link to={"/perfil"} className="w-full">
                    <button className="w-full h-10 rounded-lg text-sky-600 bg-white hover:bg-gray-100 transition-colors">
                      Perfil
                    </button>
                  </Link>
                  <button
                    className="w-full h-10 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Header;