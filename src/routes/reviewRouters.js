import express from "express";
import { addComment, createReview, deleteComment, deleteCommentAdmin, deleteReview, deleteReviewAdmin, editComment, getReviewsByBook, toggleLikeReview, updateReview, updateReviewAdmin } from "../controllers/rewievController.js";
import verifyToken from "../middleware/protected/verifyToken.js";

const reviewRoutes = express.Router();

reviewRoutes.post("/", verifyToken, createReview);
reviewRoutes.get("/:bookId", getReviewsByBook);
reviewRoutes.put("/:reviewId", verifyToken, updateReview);
reviewRoutes.delete("/:reviewId", verifyToken, deleteReview);
reviewRoutes.delete("/admin/:reviewId", verifyToken, deleteReviewAdmin);
reviewRoutes.put("/admin/:reviewId", verifyToken, updateReviewAdmin);

// Like API
reviewRoutes.put("/like/:reviewId", verifyToken, toggleLikeReview);

// Comment API-ləri
reviewRoutes.post("/comment/:reviewId", verifyToken, addComment);
reviewRoutes.put("/comment/:reviewId/:commentId", verifyToken, editComment);
reviewRoutes.delete("/comment/:reviewId/:commentId", verifyToken, deleteComment);
reviewRoutes.delete("/comment/admin/:reviewId/:commentId", verifyToken, deleteCommentAdmin);


export default reviewRoutes;
