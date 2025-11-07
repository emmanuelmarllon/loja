// src/routes/userRoutes.js
import express from "express";
import { authMiddleware } from "../controllers/authController.js";
import { getUserPurchases } from "../controllers/userController.js";

const router = express.Router();

/**
 * Retorna o histórico de compras do usuário autenticado
 * GET /:id/purchases
 * Protegido pelo middleware de autenticação
 */
router.get("/:id/purchases", authMiddleware, getUserPurchases);

export default router;
