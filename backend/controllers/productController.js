import { check, validationResult } from "express-validator";
import Products from "../models/Productos.js";
import Categories from "../models/Categorias.js";

const createProducts = async (req, res) => {
  const { name, description, price, stock, status, CategoryId } = req.body;

  // Validaciones
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
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
    .withMessage("El producto tiene que tener precio")
    .bail() // si no tiene precio, no sigue con isFloat
    .isFloat({ min: 0, max: 5000000000 })
    .withMessage("El precio debe ser un número válido entre 0 y 5,000,000,000")
    .run(req);

  await check("stock")
    .notEmpty()
    .withMessage("El producto tiene que tener stock")
    .bail()
    .isInt({ min: 0, max: 2000 })
    .withMessage("El stock debe ser un número válido entre 0 y 2000")
    .run(req);

  // Captura errores
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  // Crear producto
  try {
    const newProduct = await Products.create({
      name,
      description,
      price,
      stock,
      status,
      CategoryId,
      UserId: req.user.id,
    });

    return res.status(201).json({
      msg: "Producto creado correctamente, ve a tu perfil para verlo",
      product: { id: newProduct.id, name: newProduct.name },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, price, stock } = req.body;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: "producto no encontrado" });
    }
  } catch (error) {
    console.log("Error al actualizar el producto", error);
    return res.status(500).json({
      msg: "Error al crear el producto",
      error: error.message,
    });
  }
};

const deletePoduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: "producto no encontrada" });
    }

    await product.destroy();

    return res.status(200).json({
      msg: "Producto eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({
      msg: "Error al eliminar la producto",
      error: error.message,
    });
  }
};

const showMyProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      where: { userId: req.user.id },
      include: {
        model: Categories,
        as: "category", 
        attributes: ["id", "name"],
      },
    });

    return res.status(200).json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("error al obtener productos:", error); 
    return res.status(500).json({
      msg: "Error al obtener los productos", 
      error: error.message,
    });
  }
};

const showAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      where: { status: "activo" },
      include: {
        model: Categories,
        as: "category", 
        attributes: ["id", "name"],
      },
    });

    return res.status(200).json({
      products,
      total: products.length,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener las productas",
      error: error.message,
    });
  }
};

export {
  createProducts,
  updateProduct,
  deletePoduct,
  showMyProducts,
  showAllProducts,
};
