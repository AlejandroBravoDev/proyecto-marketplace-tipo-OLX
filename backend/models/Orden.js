import { DataTypes, NOW } from "sequelize";
import db from "../config/db.js";

const Order = db.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  name:{
    type: DataTypes.STRING(155),
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pendiente", "pago", "enviado", "cancelado"),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phoneNumber:{
    type:DataTypes.INTEGER(55),
    allowNull:false
  },
  payMethod: {
    type: DataTypes.ENUM("tarjeta", "contra_entrega", "transferencia"),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: NOW,
  },
});

export default Order;
