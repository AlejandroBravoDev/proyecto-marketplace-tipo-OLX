import sequelize from "../config/db.js";
import Order from "../models/Orden.js";
import Cart from "../models/Carrito.js";
import ItemCart from "../models/CarritoItem.js";
import Products from "../models/Productos.js";
import OrderItem from "../models/OrdenItem.js";

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name, address, payMethod, phoneNumber } = req.body;

    if (!name || !address || !payMethod) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    const cart = await Cart.findOne({
      where: { UserId: userId, status: "activo" },
      include: [{ model: ItemCart, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Carrito vacío" });
    }

    for (const item of cart.items) {
      const product = await Products.findByPk(item.ProductId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product || product.stock < item.amount) {
        throw new Error(`Stock insuficiente para ${product?.name}`);
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

    for (const item of cart.items) {
      const product = await Products.findByPk(item.ProductId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      // reducir stock
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
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ msg: error.message || "Error creando orden" });
  }
};

export { createOrder };
