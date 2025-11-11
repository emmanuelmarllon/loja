import { createOrUpdatePending } from "../services/purchaseService.js";

export const checkoutController = async (req, res) => {
  console.log("[CHECKOUT] Iniciando checkout");
  console.log("[CHECKOUT] userId:", req.userId);
  console.log("[CHECKOUT] items recebidos:", req.body.items);

  try {
    const purchase = await createOrUpdatePending(req.userId, req.body.items);
    console.log("[CHECKOUT] Compra criada/atualizada:", purchase);

    res.json({ success: true, purchase });
  } catch (err) {
    console.error("[CHECKOUT] Erro ao criar/atualizar compra:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
