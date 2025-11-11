import { prisma } from "../utils/prisma.js";
import * as purchaseService from "../services/purchaseService.js";
export const getUserPurchasesController = async (req, res) => {
  try {
    const userId = req.userId; // pega do token
    const purchases = await purchaseService.getUserPurchases(userId);
    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Cria ou atualiza compra pendente
export const createOrUpdatePending = async (userId, items) => {
  // ... seu código atual aqui
};

// Retorna compra pendente
export const getPending = async (userId) => {
  return prisma.purchase.findFirst({
    where: { userId, status: "pending" },
  });
};

// Atualiza status da compra
export const updateStatus = async (txid, status) => {
  const purchase = await prisma.purchase.findUnique({ where: { txid } });
  if (!purchase) throw new Error("Compra não encontrada");

  return prisma.purchase.update({ where: { txid }, data: { status } });
};
