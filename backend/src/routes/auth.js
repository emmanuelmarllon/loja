// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  me,
  checkoutController,
  authMiddleware,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Endpoint para registrar um novo usuário
 * POST /register
 */
router.post("/register", register);

/**
 * Endpoint para login de usuário
 * POST /login
 */
router.post("/login", login);

/**
 * Endpoint para retornar os dados do usuário autenticado
 * GET /me
 * Protegido pelo middleware de autenticação
 */
router.get("/me", authMiddleware, me);

/**
 * Endpoint para processar checkout de compras
 * POST /checkout
 * Protegido pelo middleware de autenticação
 */
router.post("/checkout", authMiddleware, checkoutController);

export default router;
