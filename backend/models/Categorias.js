import { DataTypes } from "sequelize";
import db from "../config/db.js";
import database from "mime-db";

const Categories = db.define("categories", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "activa",
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    onDelete: "CASCADE",
    references: {
      model: "Users",
      key: "id",
    },
  },
});

export default Categories;
