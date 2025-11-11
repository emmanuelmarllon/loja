// src/routes/index.js
import express from "express";
import productRoutes from "./productRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import authRoutes from "./authRoutes.js";
import userPurchaseRoutes from "./userPurchaseRoutes.js";
import reviewRoutes from "./reviewsRoutes.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`[ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

router.use("/products", productRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/payment", paymentRoutes);
router.use("/auth", authRoutes);
router.use("/userPurchase", userPurchaseRoutes);
router.use("/reviews", reviewRoutes);

export default router;
