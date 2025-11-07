// src/controllers/userController.js
import { prisma } from "../utils/prisma.js";

/**
 * Retorna o histórico de compras de um usuário autenticado
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 */
export const getUserPurchases = async (req, res) => {
  try {
    const userIdParam = req.params.id;  // ID do usuário solicitado
    const authUserId = req.userId;      // ID do usuário autenticado (do middleware)

    // Verifica se o usuário autenticado tem permissão para acessar essas compras
    if (authUserId.toString() !== userIdParam.toString()) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Busca compras do usuário ordenadas pela data (mais recentes primeiro)
    const purchases = await prisma.purchase.findMany({
      where: { userId: userIdParam },
      orderBy: { createdAt: "desc" },
    });

    // Retorna array de compras (ou array vazio se não houver)
    res.json(Array.isArray(purchases) ? purchases : []);
  } catch {
    // Retorna erro genérico em caso de falha
    res.status(500).json({ error: "Erro ao buscar compras" });
  }
};
