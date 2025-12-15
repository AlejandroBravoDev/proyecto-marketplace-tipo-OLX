import { check, validationResult } from "express-validator";
import Categories from "../models/Categorias.js";

const createCategories = async (req, res) => {
  try {
    const { name, status } = req.body;

    await check("name")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío")
      .isLength({ min: 3, max: 55 })
      .withMessage("El nombre no está en el rango permitido")
      .run(req);

    let result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const categoryExist = await Categories.findOne({ where: { name } });

    if (categoryExist) {
      return res
        .status(400)
        .json({ msg: "Ya existe una categoría con este nombre" });
    }

    const newCategory = await Categories.create({
      name,
      status,
      userId: req.user.id,
    });

    return res.status(201).json({
      msg: "Categoría creada correctamente",
      category: {
        id: newCategory.id,
        name: newCategory.name,
      },
    });
  } catch (error) {
    console.error("ERROR AL CREAR CATEGORÍA:", error);
    return res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};

const showAllCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      where: { userId: req.user.id },
    });

    return res.status(200).json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener las categorías",
      error: error.message,
    });
  }
};
const showActiveCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      where: { status: "activa" }, // 👈 SOLO ACTIVAS, PARA TODOS
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error en showActiveCategories:", error);
    return res.status(500).json({
      msg: "Error al obtener las categorías activas",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Solo actualiza el status
    await category.update({
      status: status !== undefined ? status : category.status,
    });

    return res.status(200).json({
      msg: "Categoría actualizada correctamente",
      categoria: category,
    });
  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    return res.status(500).json({
      msg: "Error al actualizar la categoría",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    await category.destroy();

    return res.status(200).json({
      msg: "Categoría desactivada correctamente",
    });
  } catch (error) {
    console.error("🔥 ERROR AL ELIMINAR CATEGORÍA:", error);
    return res.status(500).json({
      msg: "Error al eliminar la categoría",
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
};
