import Cart from "../models/Carrito.js";
import ItemCart from "../models/CarritoItem.js";
import Products from "../models/Productos.js";

const addToCart = async (req, res) => {
  try {
    //verifica que el usuario esté autenticado
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "No autenticado" });

    //trae la id del producto y la cantidad de productos
    const { productId, amount = 1 } = req.body;

    //si la id no existe retorna error
    if (!productId)
      return res.status(400).json({ msg: "productId es requerido" });

    //si existe la busca en la tabla productos
    const product = await Products.findByPk(productId);
    if (!product)
      return res.status(404).json({ msg: "Producto no encontrado" });

    //si el usuario intenta comprar más de lo que hay en stock retorna error
    if (product.stock < amount) {
      return res.status(400).json({ msg: "Stock insuficiente" });
    }

    // Buscar o crear carrito activo del usuario
    let cart = await Cart.findOne({
      where: { UserId: userId, status: "activo" },
    });
    if (!cart) {
      cart = await Cart.create({ UserId: userId, status: "activo" });
    }

    // Buscar item existente
    let item = await ItemCart.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });
    if (item) {
      item.amount = item.amount + Number(amount);
      await item.save();
    } else {
      item = await ItemCart.create({
        amount: Number(amount),
        unitPrice: product.price,
        CartId: cart.id,
        ProductId: productId,
      });
    }

    return res.status(200).json({ msg: "Producto agregado al carrito", item });
  } catch (error) {
    console.error("addToCart error:", error);
    return res
      .status(500)
      .json({ msg: "Error agregando al carrito", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "No autenticado" });

    const cart = await Cart.findOne({
      where: { UserId: userId, status: "activo" },
    });

    if (!cart) {
      return res.status(200).json({
        items: [],
        total: 0,
        totalAmount: 0,
      });
    }

    const items = await ItemCart.findAll({
      where: { CartId: cart.id },
      include: [
        {
          model: Products,
          attributes: ["id", "name", "price", "images", "stock"],
        },
      ],
    });

    const mapped = items.map((it) => {
      const product =
        it.product || it.Product || it.Products || it.dataValues.Product;

      const unitPrice = it.unitPrice;
      const subtotal = unitPrice * it.amount;

      return {
        id: it.id,
        amount: it.amount,
        unitPrice,
        subtotal,
        product,
      };
    });

    const total = mapped.reduce((s, it) => s + it.subtotal, 0);
    const totalAmount = mapped.reduce((s, it) => s + it.amount, 0);

    return res.status(200).json({
      items: mapped,
      total,
      totalAmount,
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res
      .status(500)
      .json({ msg: "Error obteniendo carrito", error: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    // usuario autenticado
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "No autenticado" });

    // id del item del carrito
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ msg: "itemId es requerido" });
    }

    // buscar carrito activo del usuario
    const cart = await Cart.findOne({
      where: { UserId: userId, status: "activo" },
    });

    if (!cart) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    // buscar el item dentro del carrito
    const item = await ItemCart.findOne({
      where: {
        id: itemId,
        CartId: cart.id,
      },
    });

    if (!item) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    // eliminar item
    await item.destroy();

    return res.status(200).json({ msg: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("deleteProductFromCart error:", error);
    return res.status(500).json({
      msg: "Error eliminando producto del carrito",
      error: error.message,
    });
  }
};

export { addToCart, getCart, deleteProductFromCart };
