import { check, validationResult } from "express-validator";
import Products from "../models/Productos";

const createProducts = async (req, res) => {
  const { name, description, price, stock, status } = req.body;

  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estár vacio")
    .isLength({ min: 5, max: 110 })
    .withMessage("El nombre no está en el rango de caracteres permitido")
    .run(req);

  await check("description")
    .notEmpty()
    .withMessage("El producto tiene que tener una descripción")
    .isLength({ max: 280 })
    .withMessage("La descripción es muy extensa")
    .run(req);

  await check("price")
    .notEmpty()
    .withMessage("el producto tiene que tener precio")
    .run(req);
  await check("stock")
    .notEmpty()
    .withMessage("El producto tiene que tener stock")
    .run(req);
  await check("status")
    .notEmpty()
    .withMessage("El producto tiene que tener un estado")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  }

  const newProduct = await Products.create({
    name,
    description,
    price,
    stock,
    status,
  });

  return res.status(201).json({
    msg: "Producto creado correctamente, ve a tu perfil para verlo",
  });
};

export { createProducts };
