import { prisma } from "../utils/prisma.js";

/**
 * Retorna o histórico de compras de um usuário autenticado
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 */
export const getUserPurchases = async (req, res) => {
  try {
    const userIdParam = req.params.id;
    const authUserId = req.userId;

    // Verifica se o usuário autenticado tem permissão para acessar esse histórico
    if (authUserId.toString() !== userIdParam.toString()) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Busca compras do usuário ordenadas pela data de criação (mais recentes primeiro)
    const purchases = await prisma.purchase.findMany({
      where: { userId: userIdParam },
      orderBy: { createdAt: "desc" },
    });

    // Retorna o array de compras (ou array vazio se não houver)
    res.json(Array.isArray(purchases) ? purchases : []);
  } catch (err) {
    // Retorna erro genérico em caso de falha
    res.status(500).json({ error: "Erro ao buscar compras" });
  }
};
