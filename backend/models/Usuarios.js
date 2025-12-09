import { DataTypes, NOW } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(155),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "cliente",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

Users.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Users;
