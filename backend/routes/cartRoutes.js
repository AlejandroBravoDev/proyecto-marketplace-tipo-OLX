import express from "express";
import verifyToken from "../middlewares/auth.js";
import { addToCart, getCart, deleteProductFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", verifyToken, addToCart); // body: { productId, amount }
router.get("/", verifyToken, getCart);
router.delete("/:itemId",verifyToken, deleteProductFromCart)

export default router;
