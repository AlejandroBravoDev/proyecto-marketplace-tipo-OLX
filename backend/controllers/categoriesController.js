import { check, param, validationResult } from "express-validator";
import Categories from "../models/Categorias.js";

// Middleware para manejar los resultados de express-validator
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createCategoriesValidations = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 3, max: 55 })
    .withMessage("El nombre debe tener entre 3 y 55 caracteres"),
  check("status")
    .optional()
    .isIn(["activa", "inactiva"])
    .withMessage("El estado debe ser 'activa' o 'inactiva'"),
  validationMiddleware,
];

const createCategories = async (req, res) => {
  try {
    const { name, status } = req.body;

    const categoryExist = await Categories.findOne({ where: { name } });

    if (categoryExist) {
      return res
        .status(400)
        .json({ msg: "Ya existe una categoría con este nombre." });
    }

    const newCategory = await Categories.create({
      name,
      status: status || "activa", // Default a activa
      userId: req.user.id,
    });

    return res.status(201).json({
      msg: "✅ Categoría creada correctamente.",
      category: {
        id: newCategory.id,
        name: newCategory.name,
        status: newCategory.status,
      },
    });
  } catch (error) {
    console.error("ERROR AL CREAR CATEGORÍA:", error);
    return res.status(500).json({
      msg: "❌ Error interno del servidor al crear categoría.",
      error: error.message,
    });
  }
};

const showAllCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      where: { userId: req.user.id },
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      msg: "📋 Categorías obtenidas correctamente.",
      categories,
      total: categories.length,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "❌ Error al obtener las categorías.",
      error: error.message,
    });
  }
};

const showActiveCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      where: { status: "activa" },
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      msg: "📋 Categorías activas obtenidas correctamente.",
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error en showActiveCategories:", error);
    return res.status(500).json({
      msg: "❌ Error al obtener las categorías activas.",
      error: error.message,
    });
  }
};

const updateCategoryValidations = [
  param("id")
    .notEmpty()
    .withMessage("El ID de la categoría es obligatorio")
    .isUUID()
    .withMessage("ID de categoría no válido"),
  check("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["activa", "inactiva"])
    .withMessage("El estado debe ser 'activa' o 'inactiva'"),
  validationMiddleware,
];

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada." });
    }

    if (category.status === status) {
      return res.status(200).json({
        msg: `El estado de la categoría ya es '${status}'.`,
        categoria: category,
      });
    }

    await category.update({ status });

    return res.status(200).json({
      msg: `🔄 Categoría actualizada a estado '${category.status}' correctamente.`,
      categoria: category,
    });
  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    return res.status(500).json({
      msg: "❌ Error al actualizar la categoría.",
      error: error.message,
    });
  }
};

const deleteCategoryValidations = [
  param("id")
    .notEmpty()
    .withMessage("El ID de la categoría es obligatorio")
    .isUUID()
    .withMessage("ID de categoría no válido"),
  validationMiddleware,
];

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada." });
    }

    await category.destroy();

    return res.status(200).json({
      msg: "🗑️ Categoría eliminada correctamente.",
    });
  } catch (error) {
    console.error("🔥 ERROR AL ELIMINAR CATEGORÍA:", error);
    return res.status(500).json({
      msg: "❌ Error al eliminar la categoría.",
      error: error.message,
    });
  }
};

export {
  createCategories,
  showAllCategories,
  updateCategory,
  deleteCategory,
  showActiveCategories,
  createCategoriesValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
};
