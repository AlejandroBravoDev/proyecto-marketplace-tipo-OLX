import express from "express";
import { createOrder } from "../controllers/orderController.js";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

export default router;
