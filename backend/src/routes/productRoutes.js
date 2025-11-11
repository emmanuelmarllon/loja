import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Middleware de log específico pra produtos
router.use((req, res, next) => {
  console.log(`[PRODUCT ROUTE] ${req.method} ${req.originalUrl}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("[PRODUCT ROUTE BODY]:", req.body);
  }
  next();
});

// Rotas de produtos
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
