import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/usersRoutes.js";
import "./models/index.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("corriendo en el puerto", port);
});
