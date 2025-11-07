import express from "express";
import { prisma } from "../utils/prisma.js";
import { ObjectId } from "mongodb";
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
// Criar produto
router.post("/", async (req, res) => {
  try {
    const novoProduto = await prisma.produtos.create({ data: req.body });
    res.json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// Editar produto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.produtos.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Deletar produto

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Tentando deletar o produto com ID:", id);

  try {
    const deleted = await prisma.produtos.delete({
      where: { id }, // só passar a string mesmo
    });

    console.log("Produto deletado com sucesso:", deleted);
    res.json(deleted);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);

    // Log detalhado
    if (error.code === "P2025") {
      console.error("Prisma não encontrou o produto com esse ID!");
    }

    res.status(404).json({ error: "Produto não encontrado" });
  }
});

export default router;
