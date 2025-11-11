import express from "express";
import { getUserPurchasesController } from "../controllers/purchaseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    console.log("[USER PURCHASES] Params recebidos:", req.params);
    console.log("[USER PURCHASES] Usuário autenticado:", req.userId);
    next();
  },
  getUserPurchasesController
);

export default router;
