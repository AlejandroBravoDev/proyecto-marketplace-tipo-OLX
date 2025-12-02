import { DataTypes, UUIDV4 } from "sequelize";
import db from "../config/db.js";

const images = db.define("images", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  url: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isMain: {
    type: DataTypes.BOOLEAN,
  },
});

export default images;
