import express from "express";
import { prisma } from "../utils/prisma.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Buscar produto por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produtos.findUnique({
      where: { id: id },
    });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: "Produto não encontrado" });
  }
});

export default router;
