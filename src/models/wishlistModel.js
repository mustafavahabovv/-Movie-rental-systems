import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  product: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image: String,
    title: String,
    description: String,
    author: String,
    price: Number,
    categories: [String],
    rating: Number
  },
  status: { type: String, enum: ["wantToRead", "alreadyRead"], required: true }, 
  addedAt: { type: Date, default: Date.now }, 
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
