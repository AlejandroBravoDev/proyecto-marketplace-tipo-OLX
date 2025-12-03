import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Categories = db.define("categories", {
  id: {
    type: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  status: {
    type: DataTypes.JSON,
    defaultValue: "activa",
    allowNull: false,
  },
});

export default Categories;
