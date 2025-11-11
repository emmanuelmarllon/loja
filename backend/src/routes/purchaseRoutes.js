import express from "express";
import { checkoutController } from "../controllers/checkoutController.js";
import { paymentCallbackController } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", checkoutController);
router.post("/payment/callback", paymentCallbackController);

export default router;
