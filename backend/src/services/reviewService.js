// src/services/reviewService.js
import { prisma } from "../utils/prisma.js";

// ================= CRIAR REVIEW =================
export const createReview = async (data, userId) => {
  console.log("[LOG] Criando review:", { data, userId });

  if (!data.productId) throw new Error("productId inválido");
  if (!data.comment || !data.rating)
    throw new Error("Comentário ou rating faltando");

  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5)
    throw new Error("Rating inválido (1 a 5)");

  const review = await prisma.review.create({
    data: {
      comment: data.comment,
      rating: data.rating,
      userId,
      productId: data.productId,
    },
    include: {
      user: { select: { id: true, user: true } }, // pega username real
    },
  });

  console.log("[LOG] Review criada:", review);
  return review;
};

// ================= PEGAR REVIEWS DE UM PRODUTO =================
export const getReviewsByProduct = async (productId) => {
  if (!productId) return [];

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { id: true, user: true } }, // username real
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

// ================= ATUALIZAR REVIEW (só dono) =================
export const updateReview = async (id, data, userId) => {
  console.log("[LOG] Tentativa de update:", { id, data, userId });

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review não encontrada");
  if (review.userId !== userId) throw new Error("Não autorizado");

  const updated = await prisma.review.update({
    where: { id },
    data: { comment: data.comment, rating: data.rating },
    include: { user: { select: { id: true, user: true } } }, // retorna username
  });

  console.log("[LOG] Review atualizada:", updated);
  return updated;
};

// ================= DELETAR REVIEW (só dono) =================
export const deleteReview = async (id, userId) => {
  console.log("[LOG] Tentativa de delete:", { id, userId });

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review não encontrada");
  if (review.userId !== userId) throw new Error("Não autorizado");

  const deleted = await prisma.review.delete({ where: { id } });
  console.log("[LOG] Review deletada:", deleted);
  return deleted;
};
