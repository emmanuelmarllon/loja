// src/routes/checkout.js
import express from "express";
import {
  authMiddleware,
  checkoutController,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Rota para processar checkout de compras
 * POST /
 * Protegida pelo middleware de autenticação
 */
router.post("/", authMiddleware, checkoutController);

export default router;
