import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, asyncHandler(reviewController.createReview));
router.get("/:productId", asyncHandler(reviewController.getReviewsByProduct));
router.put("/:id", authMiddleware, asyncHandler(reviewController.updateReview));
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(reviewController.deleteReview)
);

export default router;
