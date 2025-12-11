import Products from "./Productos.js";
import Categories from "./Categorias.js";
import Users from "./Usuarios.js";
import Images from "./ImagenProducto.js";
import Cart from "./Carrito.js";
import ItemCart from "./CarritoItem.js";
import Order from "./Orden.js";
import OrderItem from "./OrdenItem.js";

//foreing keys y relaciones
//relación producto-categorias
Products.belongsTo(Categories, { foreignKey: "CategoryId" });
Categories.hasMany(Products, { foreignKey: "CategoryId" });

//relación usuario - categoria
Users.hasMany(Categories, { foreignKey: "userId", as: "categories" });
Categories.belongsTo(Users, { foreignKey: "userId", as: "users" });


//relación producto-usuario
Products.belongsTo(Users, { foreignKey: "UserId" });
Users.hasMany(Products, { foreignKey: "UserId" });

//relación imagenes-productos
Images.belongsTo(Products, { foreignKey: "ProductId", as: "product" });
Products.hasMany(Images, { foreignKey: "ProductId", as: "productImages" });

//relación usuario-carrito
Cart.belongsTo(Users, { foreignKey: "UserId" });
Users.hasOne(Cart, { foreignKey: "UserId" });

//relación itemCarrito-carrito
ItemCart.belongsTo(Cart, { foreignKey: "CartId" });
Cart.hasMany(ItemCart, { foreignKey: "CartId" });

//relación itemCarrito-producto
ItemCart.belongsTo(Products, { foreignKey: "ProductId" });
Products.hasMany(ItemCart, { foreignKey: "ProductId" });

//relación usuario-orden
Order.belongsTo(Users, { foreignKey: "UserId" });
Users.hasMany(Order, { foreignKey: "UserId" });

//relación orden-itemorden
OrderItem.belongsTo(Order, { foreignKey: "OrderId", as: "pedido" });
Order.hasMany(OrderItem, { foreignKey: "OrderId", as: "items" });

//relación producto-item
OrderItem.belongsTo(Products, { foreignKey: "PoductId", as: "product" });
Products.hasMany(OrderItem, { foreignKey: "ProductId", as: "items" });

export {
  Products,
  Categories,
  Users,
  Images,
  Cart,
  ItemCart,
  Order,
  OrderItem,
};
