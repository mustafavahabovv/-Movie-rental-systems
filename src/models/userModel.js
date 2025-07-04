import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String
  },

    isLogin: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    favCategories: { type: [String], default: [] },
  },
  { collection: "Users", timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
