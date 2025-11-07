// src/routes/productsRoutes.js
import express from "express";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

/**
 * Retorna todos os produtos
 * GET /
 */
router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produtos.findMany();
    res.json(produtos);
  } catch {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

/**
 * Retorna um produto pelo ID
 * GET /:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produtos.findUnique({
      where: { id },
    });
    res.json(produto);
  } catch {
    res.status(500).json({ error: "Produto não encontrado" });
  }
});

/**
 * Cria um novo produto
 * POST /
 */
router.post("/", async (req, res) => {
  try {
    const novoProduto = await prisma.produtos.create({ data: req.body });
    res.json(novoProduto);
  } catch {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

/**
 * Atualiza um produto existente pelo ID
 * PUT /:id
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.produtos.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

/**
 * Deleta um produto pelo ID
 * DELETE /:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.produtos.delete({
      where: { id },
    });
    res.json(deleted);
  } catch (error) {
    // Caso o produto não seja encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

export default router;
