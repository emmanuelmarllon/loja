import { prisma } from "./prisma.js";

async function addCreatedAtToPurchases() {
  const purchases = await prisma.purchase.findMany();

  for (const p of purchases) {
    if (!p.createdAt) {
      await prisma.purchase.update({
        where: { id: p.id },
        data: { createdAt: new Date() },
      });
    }
  }

  ("Campo createdAt adicionado em todos os documentos sem ele");
}

addCreatedAtToPurchases();
