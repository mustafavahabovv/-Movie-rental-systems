import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        image: { type: String },
        text: { type: String },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, 
      },
    ], 
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
