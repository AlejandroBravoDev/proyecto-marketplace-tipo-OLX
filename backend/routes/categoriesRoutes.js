import express from "express";
import {
  createCategories,
  showActiveCategories,
  showAllCategories,
  updateCategory,
  deleteCategory,
  createCategoriesValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
} from "../controllers/categoriesController.js";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";
const router = express.Router();

router.get("/active", showActiveCategories);

router.get("/", verifyToken, showAllCategories);

// Validar campos de creación (name, status)
router.post(
  "/",
  verifyToken,
  isAdmin,
  createCategoriesValidations,
  createCategories
);

// Validar :id y campos de actualización (status)
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateCategoryValidations,
  updateCategory
);

// Validar :id
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteCategoryValidations,
  deleteCategory
);

export default router;
