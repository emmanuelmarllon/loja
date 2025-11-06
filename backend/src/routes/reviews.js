import express from "express";
import { prisma } from "../utils/prisma.js";
const router = express.Router();

// Listar reviews de um produto
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  console.log("Recebendo productId:", productId);

  try {
    const reviews = await prisma.reviews.findMany({
      where: { productId },
    });
    res.json(reviews);
  } catch (err) {
    console.error("Erro ao buscar avaliações:", err);
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// Criar review
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
  } catch (err) {
    console.error("Erro ao criar avaliação:", err);
    res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

export default router;
