import Products from "./Productos";
import Categories from "./Categorias";
import Users from "./Usuarios";
import Images from "./ImagenProducto";
import Cart from "./Carrito";
import ItemCart from "./CarritoItem";
import Order from "./Orden";

//foreing keys
Products.belongsTo(Categories, {
  foreignKey: "CategoryId",
});

Products.belongsTo(Users, {
  foreignKey: "UserId",
});

Images.belongsTo(Products, {
  foreignKey: "ProductId",
});

Cart.belongsTo(Users, {
  foreignKey: "UserId",
});

//foreings keys para los items del carrito
ItemCart.belongsTo(Cart, {
  foreignKey: "CartId",
});

ItemCart.belongsTo(Products, {
  foreignKey: "ProductId",
});

Order.belongsTo(Users, {
  foreignKey: "UserId",
});

export { Products, Categories, Users, Images, ItemCart };
