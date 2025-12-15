import sequelize from "../config/db.js";
import { check, param, validationResult } from "express-validator";
import {
  Order,
  Cart,
  ItemCart,
  Products,
  OrderItem,
} from "../models/asociaciones.js";

// Middleware para manejar los resultados de express-validator
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createOrderValidations = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre para el pedido es obligatorio"),
  check("address")
    .trim()
    .notEmpty()
    .withMessage("La dirección de envío es obligatoria"),
  check("payMethod")
    .trim()
    .notEmpty()
    .withMessage("El método de pago es obligatorio"),
  check("phoneNumber")
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage("Número de teléfono no válido"),
  validationMiddleware,
];

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name, address, payMethod, phoneNumber } = req.body;

    const cart = await Cart.findOne({
      where: { UserId: userId, status: "activo" },
      include: [{ model: ItemCart, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cart || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({ msg: "Carrito vacío. No se puede crear un pedido." });
    }

    for (const item of cart.items) {
      const product = await Products.findByPk(item.ProductId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product || product.stock < item.amount) {
        await t.rollback();
        // Mensaje de error más específico para el usuario
        return res.status(400).json({ 
            msg: `⚠️ Stock insuficiente para el producto: ${product?.name || 'ID no encontrado'}. Por favor, ajusta la cantidad.` 
        });
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.unitPrice * item.amount,
      0
    );

    const order = await Order.create(
      {
        name,
        total,
        status: "pendiente",
        address,
        payMethod,
        phoneNumber,
        UserId: userId,
      },
      { transaction: t }
    );

    // Mover items del carrito a OrderItems y reducir stock
    for (const item of cart.items) {
      const product = await Products.findByPk(item.ProductId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      product.stock -= item.amount;
      await product.save({ transaction: t });

      await OrderItem.create(
        {
          OrderId: order.id,
          ProductId: item.ProductId,
          amount: item.amount,
          unitPrice: item.unitPrice,
          subtotal: item.amount * item.unitPrice,
        },
        { transaction: t }
      );
    }

    cart.status = "cerrado";
    await cart.save({ transaction: t });

    await t.commit();
    return res.status(201).json({
        msg: "✅ Pedido creado exitosamente.",
        order,
    });
  } catch (error) {
    await t.rollback();
    console.error("createOrder error:", error);
    return res.status(500).json({ msg: "❌ Error creando orden.", error: error.message || "Error desconocido" });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["id", "name", "price", "images"],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      msg: "📋 Pedidos obtenidos correctamente.",
      orders,
      total: orders.length,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "❌ Error al obtener tus pedidos.",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Products,
              as: "product",
              attributes: ["id", "name", "price", "images"],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    const cleanOrders = orders.map((order) => {
      const o = order.toJSON();
      return {
        ...o,
        items: (o.items || []).filter((item) => item && item.product),
      };
    });

    return res.status(200).json({
      msg: "📋 Todos los pedidos obtenidos correctamente.",
      orders: cleanOrders,
      total: orders.length,
    });
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({
      msg: "❌ Error al obtener los pedidos.",
      error: error.message,
    });
  }
};

const updateOrderStatusValidations = [
  param("orderId")
    .notEmpty()
    .withMessage("El ID del pedido es obligatorio")
    .isUUID()
    .withMessage("ID del pedido no válido"),
  check("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["pendiente", "pagado", "enviado", "entregado", "cancelado"])
    .withMessage("Estado no válido. Los estados permitidos son: pendiente, pagado, enviado, entregado, cancelado"),
  validationMiddleware,
];

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ msg: "Pedido no encontrado." });
    }

    if (order.status === status) {
        return res.status(200).json({
            msg: `El estado del pedido ya es '${status}'. No se realizó ningún cambio.`,
            order,
        });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      msg: `🔄 Estado del pedido actualizado a '${status}' correctamente.`,
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({
      msg: "❌ Error al actualizar el estado del pedido.",
      error: error.message,
    });
  }
};

const cancelOrderValidations = [
  param("orderId")
    .notEmpty()
    .withMessage("El ID del pedido es obligatorio")
    .isUUID()
    .withMessage("ID del pedido no válido"),
  validationMiddleware,
];

const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      where: {
        id: orderId,
        UserId: userId,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ msg: "Pedido no encontrado." });
    }

    if (order.status !== "pendiente") {
      await t.rollback();
      return res.status(400).json({ msg: `Este pedido ya tiene el estado '${order.status}' y no se puede cancelar.` });
    }

    for (const item of order.items) {
      const product = await Products.findByPk(item.ProductId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (product) {
        product.stock += item.amount;
        await product.save({ transaction: t });
      }
    }

    order.status = "cancelado";
    await order.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      msg: "🗑️ Pedido cancelado y stock restablecido correctamente.",
    });
  } catch (error) {
    await t.rollback();
    console.error("cancelOrder error:", error);
    return res.status(500).json({
      msg: "❌ Error al cancelar el pedido.",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrderByUserId,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  createOrderValidations,
  updateOrderStatusValidations,
  cancelOrderValidations,
};