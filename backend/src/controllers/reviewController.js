// src/controllers/reviewController.js
import * as reviewService from "../services/reviewService.js";

// ================= GET REVIEWS DE UM PRODUTO =================
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    res.json(reviews);
  } catch (err) {
    console.error("[REVIEWS GET ERROR]", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= CRIAR REVIEW =================
export const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user.id);
    res.status(201).json(review);
  } catch (err) {
    console.error("[REVIEWS CREATE ERROR]", err);
    res.status(400).json({ error: err.message });
  }
};

// ================= ATUALIZAR REVIEW (só dono) =================
export const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json(updated);
  } catch (err) {
    console.error("[REVIEWS UPDATE ERROR]", err);
    res.status(400).json({ error: err.message });
  }
};

// ================= DELETAR REVIEW (só dono) =================
export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user.id);
    res.json({ message: "Review deletada com sucesso" });
  } catch (err) {
    console.error("[REVIEWS DELETE ERROR]", err);
    res.status(400).json({ error: err.message });
  }
};
