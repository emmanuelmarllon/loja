import express from "express";
import { checkoutController } from "../controllers/checkoutController.js";
import { generatePixController } from "../controllers/pixController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Middleware de log específico pra checkout
router.use((req, res, next) => {
  console.log(`[CHECKOUT ROUTE] ${req.method} ${req.originalUrl}`);
  if (req.method === "POST") console.log("[CHECKOUT BODY]:", req.body);
  next();
});

// Cria/atualiza compra
router.post("/", authMiddleware, checkoutController);

// Gera Pix
router.get("/pix", generatePixController);

export default router;
