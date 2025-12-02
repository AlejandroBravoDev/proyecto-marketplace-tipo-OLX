import Products from "./Productos";
import Categories from "./Categorias";
import Users from "./Usuarios";
import Images from "./ImagenProducto";
import Cart from "./Carrito";
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
})


export { Products, Categories, Users, Images };
