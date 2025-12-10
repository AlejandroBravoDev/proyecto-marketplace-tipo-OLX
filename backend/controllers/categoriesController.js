import { check, validationResult } from "express-validator";
import Categories from "../models/Categorias";

const createCategories = async (req, res) => {
  try {
    const { name, status } = req.body;

    await check("name")
      .notEmpty()
      .withMessage("El nombre no puede estár vacio")
      .isLength({ min: 3, max: 15 })
      .withMessage("El nombre no está en el rango de caracteres permitido")
      .run(req);

    await check("status")
      .notEmpty()
      .withMessage("La categoria debe tener un estado ya sea activa u oculta")
      .run(req);

    let result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const categoryExist = await Categories.findOne({ where: { name } });

    if (categoryExist) {
      return res.status(400).json({
        msg: "Ya existe una categoria con este nombre",
      });
    }

    const newCategory = await Categories.create({
      name,
      status,
    });

    return res.status(201).json({
      msg: "Producto creado correctamente, ve a tu perfil para verlo",
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

const showCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      where: { status: activa },
    });

    return res.status(200).json({
      categorias: categories,
      total: categories.length,
    });
  } catch (error) {
    console.log("error completo", error);

    return res.status(500).json({
      msg: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

export { createCategories };
