import express from "express";
import { 
    createOrder, 
    getOrderByUserId, 
    cancelOrder,
    updateOrderStatus, 
    getAllOrders,
    // 💡 Importar validaciones
    createOrderValidations,
    cancelOrderValidations,
    updateOrderStatusValidations
} from "../controllers/orderController.js";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// Validar campos de creación (name, address, payMethod, phoneNumber)
router.post("/", verifyToken, createOrderValidations, createOrder);

router.get("/", verifyToken, getOrderByUserId);

// Validar :orderId
router.put("/:orderId/cancel", verifyToken, cancelOrderValidations, cancelOrder);

router.get("/", verifyToken, isAdmin, getAllOrders) // Nota: Agregué verifyToken aquí por seguridad, ya que isAdmin lo requiere

// Validar :orderId y el campo 'status'
router.put("/:orderId/status", verifyToken, isAdmin, updateOrderStatusValidations, updateOrderStatus);

export default router;