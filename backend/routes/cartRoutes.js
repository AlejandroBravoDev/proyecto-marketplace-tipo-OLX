import express from "express";
import verifyToken from "../middlewares/auth.js";
import { addToCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", verifyToken, addToCart); // body: { productId, amount }
router.get("/", verifyToken, getCart);

export default router;
