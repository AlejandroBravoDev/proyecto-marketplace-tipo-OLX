import express from "express";
import {
  createCategories,
  showActiveCategories,
  showAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";
  
const router = express.Router();

router.get("/active", showActiveCategories);

router.get("/", verifyToken, showAllCategories);

router.post("/", isAdmin, createCategories);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory); 

export default router;
