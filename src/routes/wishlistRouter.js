import express from "express";
import { addToWishlist, getUserWishlist, removeFromWishlist, updateWishlistStatus } from "../controllers/wishlistController.js";


const wishlistRouter = express.Router();

wishlistRouter.post("/add", addToWishlist);

wishlistRouter.get("/:userId", getUserWishlist);

wishlistRouter.put("/update", updateWishlistStatus);

wishlistRouter.delete("/remove/:wishlistId", removeFromWishlist);

export default wishlistRouter;
