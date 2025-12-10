import express from "express";
import { createProducts } from "../controllers/productsController.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/products", isAdmin, createProducts);

export default router;
