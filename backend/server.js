import express from "express";
import db from "./config/db.js";
import "./models/index.js";

const app = express();
app.use(express.json());

const DBconnection = async () => {
  try {
    await db.authenticate();
    console.log("conexion a la base de datos mela");

    await db.sync({ alter: false });
    console.log("modelos sincronizados melo");
  } catch (error) {
    console.log(error);
  }
};

DBconnection();
