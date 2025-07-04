import Review from "../models/reviewModel.js";
import user from "../models/userModel.js";

export const createReview = async (req, res) => {
  try {
    const { bookId, content, rating } = req.body;
    const userId = req.user.id; 

    const newReview = new Review({
      bookId,
      userId,
      content,
      rating,
    });

    await newReview.save();
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId }).populate(
      "userId",
      "username image"
    );

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    review.content = content;
    review.rating = rating;
    await review.save();

    res.status(200).json({ success: true, message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    const likedIndex = review.likes.indexOf(userId);

    if (likedIndex === -1) {
      review.likes.push(userId);
    } else {
      review.likes.splice(likedIndex, 1);
    }

    await review.save();
    res.status(200).json({ success: true, likes: review.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    const cuser = await user.findById(userId); 
    if (!cuser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const username = cuser.username;
    const image = cuser.image;

    const newComment = { userId, username, text, image };
    review.comments.push(newComment);

    await review.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const editComment = async (req, res) => {
  try {
    const { reviewId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    const comment = review.comments.find(
      (c) => c._id.toString() === commentId && c.userId.toString() === userId
    );
    if (!comment)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or comment not found" });

    comment.text = text;
    await review.save();

    res.status(200).json({ success: true, comments: review.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { reviewId, commentId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    const commentIndex = review.comments.findIndex(
      (c) => c._id.toString() === commentId && c.userId.toString() === userId
    );
    if (commentIndex === -1)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or comment not found" });

    review.comments.splice(commentIndex, 1);
    await review.save();

    res.status(200).json({ success: true, comments: review.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentAdmin = async (req, res) => {
  try {
    const { reviewId, commentId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    const commentIndex = review.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    review.comments.splice(commentIndex, 1);
    await review.save();

    res.status(200).json({ success: true, comments: review.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReviewAdmin = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, rating } = req.body;

    const review = await Review.findOne({ _id: reviewId});

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    review.content = content;
    review.rating = rating;
    await review.save();

    res.status(200).json({ success: true, message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};