function Login() {
  return (
    <>
      {/*div que va a hacer el padding para que se vea más al centro*/}
      <div
        className="w-full h-210 flex flex-row gap-10 py-40 px-70 "
        id="main-container"
      >
        <article className=" w-6/12 h-4/6 flex flex-col gap-8 max-h-full">
          <h1 className="text-[#006e18] text-5xl font-bold">ParcheMarket</h1>
          <p className="text-2xl max-w-100">
            Únete a ParcheMarket, el marketplace que te conecta con los mejores
            productos y servicios. Regístrate o inicia sesión para comprar,
            vender y acceder a ofertas exclusivas. ¡Es rápido, seguro y está
            hecho para ti!
          </p>
        </article>

        <form
          action="post"
          className="w-105 h-95 bg-white shadow-xl rounded-2xl flex flex-col gap-5 p-5 text-center items-center"
        >
          <input
            type="text"
            placeholder="Correo Electronico"
            name="email"
            className="w-full border border-gray-400 h-12 rounded-lg p-4"
          />

          <input
            type="text"
            placeholder="Contraseña"
            name="password"
            className="w-full border border-gray-400 h-12 rounded-lg p-4"
          />

          <button
            type="submit"
            className="w-full bg-[#006e18] text-white font-semibold text-lg h-12 rounded-lg"
          >
            Iniciar Sesión
          </button>

          <a href="" className="text-[#00781a]">
            ¿Olvidaste tu Contraseña?
          </a>

          <hr className="border-gray-400 w-full" />

          <button className="w-4/6 bg-[#00781a] text-white font-semibold  h-12 rounded-lg">
            Crear una cuenta nueva
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
