import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import Users from "../models/Usuarios.js";
import emailPassword from "../helpers/email.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  //validaciones
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estár vacio")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage("Esto no parece un correo")
    .run(req);

  await check("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña tiene que ser de almenos 8 caracteres")
    .run(req);

  await check("repeatPassword")
    .custom((value) => value === password)
    .withMessage("La contraseña no es igual")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.status(400).json({
      errors: resultado.array(),
    });
  }

  //si no hay errores simplemente se crea el usuario
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const userExist = await Users.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({
        msg: "Este correo ya está en uso, por favor ingresa con otro correo",
      });
    }

    const newUser = await Users.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      msg: "Inicia sesión para poder acceder a nuestros beneficios",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el serivdor" });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    await check("email")
      .notEmpty()
      .withMessage("No puedes dejar este campo vacio")
      .run(req);

    await check("password")
      .notEmpty()
      .withMessage(
        "Tienes que ingresar una contraseña para poder iniciar sesión"
      )
      .run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
      return res.status(400).json({
        errors: resultado.array(),
      });
    }
    const User = await Users.findOne({ where: { email } });

    if (!User) {
      return res.status(400).json({
        msg: "Este correo NO está registrado",
      });
    }

    const verifyPassword = await bcrypt.compare(password, User.password);

    if (!verifyPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta",
      });
    }

    res.json({
      msg: "Inicio de sesión exitoso",
      usuario: {
        id: User.id,
        name: User.name,
        email: User.email,
      },
    });
  } catch (error) {
    console.error("🔥 ERROR EN LOGIN:", error);
    res.status(500).json({
      msg: "Error interno en el servidor",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validación del correo
  await check("email")
    .isEmail()
    .withMessage("Esto no parece un correo válido")
    .run(req);

  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    return res.status(400).json({
      errors: resultado.array(),
    });
  }

  // Buscar usuario
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({
      msg: "Este correo NO está registrado",
    });
  }

  // Generar token seguro
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Enviar correo
  await emailPassword({
    email: user.email,
    nombre: user.name,
    token,
  });

  // Respuesta
  res.json({
    msg: "Hemos enviado un correo con instrucciones para recuperar tu contraseña",
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Token inválido o usuario inexistente" });
    }

    user.password = password;
    await user.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(400).json({ msg: "Token inválido o expirado" });
  }
};
export { registerUser, LoginUser, forgotPassword, resetPassword };
