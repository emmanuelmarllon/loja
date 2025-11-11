// controllers/pixController.js
import * as pixService from "../services/pixService.js";
import { getPending } from "../services/purchaseService.js";

export const generatePixController = async (req, res) => {
  try {
    const userId = req.userId; // pega do token via authMiddleware
    console.log("[PIX] Gerando Pix para userId:", userId);

    // Busca compra pendente
    const pending = await getPending(userId);
    console.log("[PIX] Compra pendente encontrada:", pending);

    if (!pending) throw new Error("Nenhuma compra pendente encontrada.");

    const { total, txid } = pending;

    // Gera o QR Code Pix com valor total
    const result = await pixService.generatePix({
      amount: total,
      description: `Pagamento de compra na LojaTech - Pedido ${txid}`,
      txid,
    });

    console.log("[PIX] Pix gerado:", result);

    res.json(result);
  } catch (err) {
    console.error("[PIX] Erro:", err.message);
    res.status(400).json({ error: err.message });
  }
};
