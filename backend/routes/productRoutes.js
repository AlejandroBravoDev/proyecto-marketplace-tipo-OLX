import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";
import { createProducts, deletePoduct, showAllProducts, showMyProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/active", showAllProducts);
router.get("/", isAdmin, showMyProducts)

//rutas del admin  
router.post("/", isAdmin, createProducts)
router.put("/:id", isAdmin, updateProduct)
router.delete("/:id", isAdmin, deletePoduct)

export default router;
