import express from "express";

import {
  addProduct,
  deleteProduct,
  getProducts,
  searchProduct,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../upload/upload.js";

const productRouter = express.Router();


productRouter.post("/", upload.single("image"), addProduct);
productRouter.get("/", getProducts);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/search/:title", searchProduct);
productRouter.put("/:productId", upload.single("image"), updateProduct); 

export default productRouter;
