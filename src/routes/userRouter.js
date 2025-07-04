import express from "express";
import {
  addAdmin,
  deleteUser,
  forgotPassword,
  getAllUsers,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  updateFavoriteCategories,
  updateProfile,
  verifyEmail,
} from "../controllers/userController.js";
import upload from "../upload/upload.js";
import verifyToken from "../middleware/protected/verifyToken.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), register);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/resend-verification", resendVerificationEmail);

userRouter.post("/login", login);
userRouter.post("/logout", verifyToken, logout);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword", resetPassword);
userRouter.put("/update", verifyToken, upload.single("image"), updateProfile);
userRouter.put("/update-favorites", verifyToken, updateFavoriteCategories);
userRouter.get("/",  getAllUsers);
userRouter.post("/admin/:id",   addAdmin);
userRouter.delete("/:userId", verifyToken, deleteUser);

export default userRouter;
