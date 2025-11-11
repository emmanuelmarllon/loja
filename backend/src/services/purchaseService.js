import { prisma } from "../utils/prisma.js";
import { v4 as uuidv4 } from "uuid";

// Retorna histórico de compras pagas do usuário
export const getUserPurchases = async (userId) => {
  if (!userId) throw new Error("userId é obrigatório");
  return prisma.purchase.findMany({ where: { userId, status: "paid" } });
};

// Cria ou atualiza compra pendente
export const createOrUpdatePending = async (userId, items) => {
  if (!userId) throw new Error("userId é obrigatório");
  if (!items || items.length === 0) throw new Error("Nenhum produto informado");

  // 1️⃣ Verifica duplicados no próprio checkout
  const itemIds = items.map((i) => i.productId);
  const duplicates = itemIds.filter((id, idx) => itemIds.indexOf(id) !== idx);
  if (duplicates.length > 0)
    throw new Error(
      "Não é permitido adicionar o mesmo produto mais de uma vez."
    );

  // 2️⃣ Verifica produtos já comprados
  const previousPurchases = await prisma.purchase.findMany({
    where: { userId, status: "paid" },
  });
  const boughtProductIds = previousPurchases.flatMap((p) =>
    p.items.map((i) => i.productId)
  );

  const purchaseItems = [];
  for (const item of items) {
    if (boughtProductIds.includes(item.productId))
      throw new Error("Você já comprou algum dos produtos selecionados.");

    const product = await prisma.produtos.findUnique({
      where: { id: item.productId },
    });
    if (!product)
      throw new Error(`Produto com ID ${item.productId} não encontrado`);

    const finalPrice = Number(
      (product.price * (1 - (product.discount || 0) / 100)).toFixed(2)
    );

    purchaseItems.push({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      discount: product.discount || 0,
    });
  }

  // 3️⃣ Calcula total
  const total = parseFloat(
    purchaseItems.reduce((acc, i) => acc + i.price, 0).toFixed(2)
  );
  if (!total || total <= 0) throw new Error("Total inválido");

  // 4️⃣ Cria ou atualiza compra pendente
  let pending = await prisma.purchase.findFirst({
    where: { userId, status: "pending" },
  });
  const createdAt = new Date();

  if (pending) {
    pending = await prisma.purchase.update({
      where: { id: pending.id },
      data: { items: purchaseItems, total, createdAt },
    });
  } else {
    const txid = `tx-${Date.now()}-${uuidv4()}`;
    pending = await prisma.purchase.create({
      data: {
        userId, // ✅ passa o userId real
        items: purchaseItems,
        total,
        txid,
        status: "pending",
        createdAt,
      },
    });
  }

  return pending;
};

// Retorna compra pendente do usuário
export const getPending = async (userId) => {
  if (!userId) throw new Error("userId é obrigatório");
  return prisma.purchase.findFirst({ where: { userId, status: "pending" } });
};

// Atualiza status da compra
export const updateStatus = async (txid, status) => {
  const purchase = await prisma.purchase.findUnique({ where: { txid } });
  if (!purchase) throw new Error("Compra não encontrada");
  return prisma.purchase.update({ where: { txid }, data: { status } });
};
