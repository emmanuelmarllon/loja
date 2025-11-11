import express from "express"; // ⚡ IMPORTANTE
import { updateStatus } from "../services/purchaseService.js";

const router = express.Router();

router.post("/callback", async (req, res) => {
  const { txid, paid } = req.body;
  console.log("[Payment] Callback recebido:", { txid, paid });

  try {
    if (paid) {
      console.log("[Payment] Atualizando status para 'paid' do txid:", txid);
      const updated = await updateStatus(txid, "paid");
      console.log("[Payment] Compra atualizada:", updated);
      res.json({ success: true, message: "Compra confirmada!" });
    } else {
      console.log("[Payment] Pagamento não realizado, mantido como pendente.");
      res.json({
        success: true,
        message: "Pagamento não realizado, compra ainda pendente.",
      });
    }
  } catch (err) {
    console.error("[Payment] Erro ao processar callback:", err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;
