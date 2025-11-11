import { updateStatus } from "../services/purchaseService.js";

export const paymentCallbackController = async (req, res) => {
  const { txid, paid } = req.body;

  try {
    if (paid) {
      await updateStatus(txid, "paid");
      res.json({ success: true, message: "Compra confirmada!" });
    } else {
      res.json({
        success: true,
        message: "Pagamento não realizado, compra ainda pendente.",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
