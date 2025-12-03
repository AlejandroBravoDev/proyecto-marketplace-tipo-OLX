import { DataTypes, NOW } from "sequelize";
import db from "../config/db.js";

const Products = db.define("products", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.JSON,
    defaultValue: "activo",
    allowNull: false,
  },
  images: {
    type: DataTypes.STRING(255),
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

export default Products;
