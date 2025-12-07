import { check, validationResult } from "express-validator";
import Users from "../models/Usuarios.js";

const registerUser = async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;

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
      msg: "Usuario registrado correctamente",
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

export default registerUser;
