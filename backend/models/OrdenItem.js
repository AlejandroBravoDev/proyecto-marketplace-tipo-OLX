import { DataTypes } from "sequelize";
import db from "../config/db.js";

const OrderItem = db.define("orderitem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default OrderItem;
