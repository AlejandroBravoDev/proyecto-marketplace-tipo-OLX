import express from "express";
import {
  registerUser,
  LoginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
