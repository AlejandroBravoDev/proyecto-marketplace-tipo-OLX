import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import verifyToken from "../middlewares/auth.js";
import multer from "multer";
import path from "path";
import {
  createProducts,
  deletePoduct,
  showAllProducts,
  showMyProducts,
  updateProduct,
  getProductById,
  getProductByCategory
} from "../controllers/productController.js";

const router = express.Router();

// configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (req, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.get("/active", showAllProducts);
router.get("/", isAdmin, showMyProducts);
router.get("/:id", isAdmin, getProductById)

//ruta para que funcione el filtro por categorias
router.get("/category/:categoryId", getProductByCategory);

// rutas del admin
router.post("/", verifyToken, isAdmin, upload.array("images", 6), createProducts);
router.put("/:id", isAdmin, upload.single("images"), updateProduct);
router.delete("/:id", isAdmin, deletePoduct);


export default router;
