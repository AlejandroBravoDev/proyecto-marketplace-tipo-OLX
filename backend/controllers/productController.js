import { check, validationResult } from "express-validator";
import Products from "../models/Productos.js";
import Categories from "../models/Categorias.js";
import Images from "../models/ImagenProducto.js";
import { Op } from "sequelize";

const createProducts = async (req, res) => {
  const { name, description, price, stock, status, CategoryId } = req.body;

  // Validaciones
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 0, max: 110 })
    .withMessage("El nombre no está en el rango de caracteres permitido")
    .run(req);

  await check("description")
    .notEmpty()
    .withMessage("El producto tiene que tener una descripción")
    .isLength({ max: 280 })
    .withMessage("La descripción es muy extensa")
    .run(req);

  await check("price")
    .notEmpty()
    .withMessage("El producto tiene que tener precio")
    .bail() // si no tiene precio, no sigue con isFloat
    .isFloat({ min: 0, max: 5000000000 })
    .withMessage("El precio debe ser un número válido entre 0 y 5,000,000,000")
    .run(req);

  await check("stock")
    .notEmpty()
    .withMessage("El producto tiene que tener stock")
    .bail()
    .isInt({ min: 0, max: 2000 })
    .withMessage("El stock debe ser un número válido entre 0 y 2000")
    .run(req);

  // Captura errores
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  // Crear producto
  try {
    const newProduct = await Products.create({
      name,
      description,
      price,
      stock,
      status,
      CategoryId,
      UserId: req.user.id,
    });

    // Si llegaron archivos, guardarlos en la tabla Images
    if (req.files && req.files.length > 0) {
      console.log(
        "createProducts - req.files:",
        req.files.map((f) => ({
          originalname: f.originalname,
          filename: f.filename,
          size: f.size,
        }))
      );
      const host = req.get("host");
      const proto = req.protocol;
      const imagesToCreate = req.files.map((file, index) => ({
        url: [proto + "://" + host + "/uploads/" + file.filename],
        isMain: index === 0,
        ProductId: newProduct.id,
      }));

      console.log("createProducts - imagesToCreate:", imagesToCreate);
      try {
        await Images.bulkCreate(imagesToCreate);
      } catch (imgError) {
        console.error("Error creating image records:", imgError);
        // do not fail the whole product creation, but report
        return res.status(500).json({
          msg: "Producto creado pero error al guardar imágenes",
          error: imgError.message,
        });
      }
      // update product.images with main image url
      try {
        const main = req.files[0];
        const host = req.get("host");
        const proto = req.protocol;
        const mainUrl = proto + "://" + host + "/uploads/" + main.filename;
        console.log("Updating product.images with:", mainUrl);
        await newProduct.update({ images: mainUrl });
      } catch (uErr) {
        console.error("Error updating product.images:", uErr);
      }
    }

    return res.status(201).json({
      msg: "Producto creado correctamente, ve a tu perfil para verlo",
      product: { id: newProduct.id, name: newProduct.name },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error al crear el producto", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, price, stock, CategoryId } = req.body;

    const product = await Products.findByPk(id);
    if (!product) {
      return res.status(404).json({ msg: "producto no encontrado" });
    }

    await product.update({
      name,
      description,
      status,
      price,
      stock,
      CategoryId,
    });

    if (req.file) {
      const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

      // actualizar tabla Images
      await Images.update({ isMain: false }, { where: { ProductId: id } });

      await Images.create({
        ProductId: id,
        url: imageUrl,
        isMain: true,
      });

      await product.update({
        images: imageUrl,
      });
    }

    return res.status(200).json({
      msg: "Producto actualizado correctamente",
    });
  } catch (error) {
    console.log("Error al actualizar el producto", error);
    return res.status(500).json({ msg: "Error al actualizar el producto" });
  }
};

const deletePoduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: "producto no encontrada" });
    }

    await product.destroy();

    return res.status(200).json({
      msg: "Producto eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({
      msg: "Error al eliminar la producto",
      error: error.message,
    });
  }
};

const showMyProducts = async (req, res) => {
  try {
    console.log("showMyProducts called - req.user:", req.user);
    if (!req.user || !req.user.id) {
      console.error("No authenticated user in request");
      return res.status(401).json({ msg: "No autenticado" });
    }
    const products = await Products.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Images,
          as: "productImages",
          attributes: ["id", "url", "isMain"],
          order: [["isMain", "DESC"]],
        },
      ],
    });

    return res.status(200).json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("error al obtener productos:", error);
    return res.status(500).json({
      msg: "Error al obtener los productos",
      error: error.message,
      stack: error.stack,
    });
  }
};

const showAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    console.log("showAllProducts - query:", req.query);

    const where = {
      status: "activo",
    };

    if (category) {
      where.CategoryId = category;
    }

    if (search) {
      // Buscar por nombre o descripción
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const products = await Products.findAll({
      where,
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Images,
          as: "productImages",
          attributes: ["id", "url", "isMain"],
        },
      ],
    });
    console.log("showAllProducts - found:", products.length);

    return res.status(200).json({
      products,
      total: products.length,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los productos",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findByPk(id);

    return res.status(200).json({
      product,
    });
  } catch (error) {}
};

const getProductByCategory = async (req, res) => {
  try {
    console.log("QUERY PARAMS:", req.query);

    const { CategoryId } = req.params;

    console.log("categoria", CategoryId);

    const product = await Products.findAll({
      where: { CategoryId: CategoryId },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Images,
          as: "productImages",
          attributes: ["id", "url", "isMain"],
        },
      ],
    });

    return res.status(200).json({
      msg: "mostrando todos los productos",
      product,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  createProducts,
  updateProduct,
  deletePoduct,
  showMyProducts,
  showAllProducts,
  getProductById,
  getProductByCategory,
};
