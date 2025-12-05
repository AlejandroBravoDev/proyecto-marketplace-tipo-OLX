import { DataTypes, NOW } from "sequelize";
import db from "../config/db.js";

const Cart = db.define("cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("activo", "convertido_en_pedido"),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: NOW,
  },
});

export default Cart;
