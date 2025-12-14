import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/usersRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import productsRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import "./models/index.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Servir archivos estáticos de uploads
app.use("/uploads", express.static("uploads"));

// Conectar BD y sincronizar modelos
// const DBconnection = async () => {
//   try {
//     await db.authenticate();
//     console.log("Conexión a la base de datos correcta");

//     await db.sync({ alter: true });
//     console.log("Modelos sincronizados correctamente");
//   } catch (error) {
//     console.log("Error al conectar la BD:", error);
//   }
// };
// DBconnection();

const port = process.env.PORT;

app.listen(port, () => {
  console.log("corriendo en el puerto", port);
});
