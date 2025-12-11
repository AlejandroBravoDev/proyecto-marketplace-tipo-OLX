import express from 'express';
import { 
  createCategories, 
  showActiveCategories,
  showAllCategories,  
  updateCategory, 
  deleteCategory 
} from '../controllers/categoriesController.js';
import isAdmin from '../middlewares/isAdmin.js';
import verifyToken from "../middlewares/auth.js"

const router = express.Router();

// ------- RUTAS PÚBLICAS PARA LA NAV (solo activas) -------
router.get("/active", verifyToken, showActiveCategories);

// ------- RUTAS DEL ADMIN (todas: activas + inactivas) -------
router.get("/", verifyToken, showAllCategories);

// CRUD categorías (admin)
router.post('/', isAdmin, createCategories);
router.put('/:id', isAdmin, updateCategory);
router.delete('/:id', isAdmin, deleteCategory);

export default router;
