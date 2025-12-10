// middleware/isAdmin.js
import jwt from "jsonwebtoken";

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "No se proporcionó token de autenticación",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        msg: "Acceso denegado. Solo administradores pueden realizar esta acción.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Token inválido o expirado",
    });
  }
};

export default isAdmin;
