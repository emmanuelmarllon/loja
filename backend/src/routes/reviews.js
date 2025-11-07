// src/routes/reviewsRoutes.js
import express from "express";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

/**
 * Lista todas as avaliações de um produto
 * GET /:productId
 */
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await prisma.reviews.findMany({
      where: { productId },
    });
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

/**
 * Cria uma nova avaliação para um produto
 * POST /:productId
 */
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { user, rating, comment } = req.body;

  try {
    const review = await prisma.reviews.create({
      data: {
        user,
        rating,
        comment,
        productId,
      },
    });
    res.json(review);
  } catch {
    res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

export default router;
