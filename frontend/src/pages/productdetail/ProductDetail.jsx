import React, { useState, useEffect } from "react";
import "./ProductDetail.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiUser } from "react-icons/hi2";
import axios from "axios";
import RatingInput from "../../components/catSelect/RatingInput";
import WishlistButtons from "../wishlist/wishlistbutton/Wishlistbutton";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const [selectedTab, setSelectedTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [visibleComments, setVisibleComments] = useState(3);
  const [sortBy, setSortBy] = useState("oldest"); 

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  const findProduct = products.find((product) => product._id === id);

  // !qeyd ed

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reviews/${id}`, { withCredentials: true })
      .then((response) => {
        setReviews(response.data.reviews);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reviews/${id}`, { withCredentials: true })
      .then((response) => {
        const updatedReviews = response.data.reviews.map((review) => ({
          ...review,
          comments: review.comments || [],
        }));
        setReviews(updatedReviews);
      });
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewText.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        { bookId: id, content: reviewText, rating },
        { withCredentials: true }
      );

      const { data } = await axios.get(
        `http://localhost:5000/api/reviews/${id}`,
        { withCredentials: true }
      );

      setReviews(data.reviews);
      setReviewText("");
      setRating(5);
      toast.success("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditReview = async () => {
    if (!editingReview) return;

    const apiUrl = user.existUser?.isAdmin
      ? `http://localhost:5000/api/reviews/admin/${editingReview._id}`
      : `http://localhost:5000/api/reviews/${editingReview._id}`;

    try {
      const { data } = await axios.put(
        apiUrl,
        { content: reviewText, rating },
        { withCredentials: true }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === editingReview._id
            ? { ...review, content: reviewText, rating }
            : review
        )
      );

      setEditingReview(null);
      setReviewText("");
      setRating(0);
      toast.success("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setReviewText(review.content);
    setRating(review.rating);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        withCredentials: true,
      });

      const { data } = await axios.get(
        `http://localhost:5000/api/reviews/${id}`,
        { withCredentials: true }
      );

      setReviews(data.reviews);
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    const totalReviews = reviews.length;

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

    return totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
  };

  const averageRating = calculateAverageRating(reviews);

  const [commentText, setCommentText] = useState("");
  const [openCommentSection, setOpenCommentSection] = useState(null);

  const toggleComments = (reviewId) => {
    setOpenCommentSection(openCommentSection === reviewId ? null : reviewId);
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/reviews/like/${reviewId}`,
        {},
        { withCredentials: true }
      );

      const { data: reviewsData } = await axios.get(
        `http://localhost:5000/api/reviews/${id}`,
        { withCredentials: true }
      );

      setReviews(reviewsData.reviews);
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const handleAddComment = async (reviewId) => {
    if (!commentText.trim()) return;

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/reviews/comment/${reviewId}`,
        { text: commentText },
        { withCredentials: true }
      );

      console.log("Server response:", data);

      if (data?.review?.comments) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? { ...review, comments: [...data.review.comments] }
              : review
          )
        );
        toast.success("Comment added successfully!");
      } else {
        console.error("No comment data received from the server.");
      }

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/comment/${reviewId}/${commentId}`,
        { withCredentials: true }
      );

      setReviews(
        reviews.map((r) =>
          r._id === reviewId
            ? { ...r, comments: r.comments.filter((c) => c._id !== commentId) }
            : r
        )
      );
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleDeleteReviewAdmin = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/admin/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      const { data } = await axios.get(
        `http://localhost:5000/api/reviews/${id}`,
        { withCredentials: true }
      );

      setReviews(data.reviews);
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleDeleteCommentAdmin = async (reviewId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/comment/admin/${reviewId}/${commentId}`,
        { withCredentials: true }
      );

      setReviews(
        reviews.map((r) =>
          r._id === reviewId
            ? { ...r, comments: r.comments.filter((c) => c._id !== commentId) }
            : r
        )
      );
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt); 
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt); 
    }
    if (sortBy === "mostLiked") {
      return (b.likes?.length || 0) - (a.likes?.length || 0); 
    }
    return 0;
  });

  return (
    <>
      <div className="container mt-5"></div>
      <div className="shadow detailShadow bg-body ">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-center flex-wrap gap-5">
              <div className="detail-image">
                <img
                  src={`http://localhost:5000/${findProduct?.image}`}
                  alt=""
                />
              </div>
              <div className="detail-content">
                <span>MustFlix Original</span>
                <h2>{findProduct?.title}</h2>
                <div className="categories d-flex gap-2">
                  {findProduct?.categories?.map((category, index) => (
                    <span key={index} className="category-badge">
                      {category}
                    </span>
                  ))}
                </div>

                <div className="ratArea">
                  <div
                    className="d-flex  align-items-center justify-content-center gap-2"
                    style={{
                      color: "#777",
                    }}
                  >
                    <i className="fa-regular fa-star"></i>
                    <p style={{ marginBottom: "0px" }}> rating</p>
                  </div>
                  <p>{averageRating}</p>
                </div>

                <WishlistButtons userId={user?.existUser?._id} productId={id} />
                <div className="d-flex mb-2 align-items-center gap-2">
                  <div>
                    <div
                      className="backHover"
                      onClick={goBack}
                      style={{ marginTop: "10px" }}
                    >
                      {" "}
                      Back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-4">
          <div className="col-12 col-sm-12 col-md-7 col-lg-8 col-xl-9 ">
            <div className="tabs d-flex justify-content-between flex-wrap">
              <div>
                <button
                  className={`tab-button ${
                    selectedTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setSelectedTab("description")}
                >
                  Story line By Author
                </button>
                <button
                  className={`tab-button ${
                    selectedTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setSelectedTab("reviews")}
                >
                  Reviews ({reviews.length})
                </button>
              </div>
              {selectedTab === "reviews" && (
                <div className="d-flex align-items-center ">
                  <select
                    className="form-select w-auto  "
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Recent</option>
                    <option value="oldest">Earliest</option>
                    <option value="mostLiked">Most Liked</option>
                  </select>
                </div>
              )}
            </div>

            {selectedTab === "description" ? (
              <div className="detail-description mt-3">
                <div className="d-flex gap-3 align-items-center">
                  <div className="user">
                    <HiUser />
                  </div>
                  <h4>{findProduct?.author}</h4>
                </div>
                <p>{findProduct?.description}</p>
              </div>
            ) : (
              <div className="tab-content">
                <div className="reviews-section mt-3">
                  {sortedReviews.length > 0 ? (
                    sortedReviews.slice(0, visibleReviews).map((review) => (
                      <div key={review._id} className="review">
                        <div className="d-flex gap-3 flex-wrap">
                          <div className="userRew">
                            {review.userId?.image ? (
                              <img
                                src={`http://localhost:5000/${review.userId.image}`}
                                alt="User"
                                className="review-user-image"
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center review-user-image">
                                <HiUser
                                  style={{
                                    fontSize: "2rem",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="d-flex gap-1 ">
                              <h5>{review.userId?.username || "Anonymous"}</h5>
                              <div className="stars">
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className={`fa-star rewievStar ${
                                      index < review.rating
                                        ? "fa-solid"
                                        : "fa-regular"
                                    }`}
                                    style={{ color: "#FFDD45" }}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <div className="review-actions">
                              <p className="text-muted">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>

                            <div className="mb-4">
                              {editingReview?._id === review._id ? (
                                <div>
                                  <textarea
                                    className="form-control"
                                    value={reviewText}
                                    onChange={(e) =>
                                      setReviewText(e.target.value)
                                    }
                                  />
                                  <RatingInput
                                    rating={rating}
                                    setRating={setRating}
                                  />
                                  <button
                                    className="btn btn-success mt-2 mx-2"
                                    onClick={handleEditReview}
                                  >
                                    Update Review
                                  </button>
                                  <button
                                    className="btn btn-secondary mt-2"
                                    onClick={() => setEditingReview(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <p className="reviewContentText">
                                  {review.content}
                                </p>
                              )}
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-light"
                                onClick={() => handleLikeReview(review?._id)}
                              >
                                👍 {review?.likes?.length} Like
                              </button>
                              <button
                                className="btn btn-light"
                                onClick={() => toggleComments(review?._id)}
                              >
                                💬 Comments ({review?.comments?.length})
                              </button>
                            </div>
                            {openCommentSection === review?._id && (
                              <div className="comments mt-2">
                                {review.comments?.length > 0 &&
                                  review.comments
                                    .slice(0, visibleComments)
                                    .map((comment) => (
                                      <div
                                        key={comment._id}
                                        className="comment "
                                      >
                                        <div className="">
                                          <div className="d-flex gap-2 align-items-center">
                                            <div className="commentImg">
                                              <img
                                                src={`http://localhost:5000/${comment.image}`}
                                                alt=""
                                              />
                                            </div>
                                            <strong>{comment?.username}</strong>
                                          </div>
                                          <div className="commentContent">
                                            <div>{comment.text}</div>
                                          </div>
                                        </div>

                                        {user &&
                                          (user.existUser?._id ===
                                            comment?.userId ||
                                            user.existUser?.isAdmin) && (
                                            <>
                                              <div className="deleteComment">
                                                <p
                                                  onClick={() =>
                                                    user.existUser?.isAdmin
                                                      ? handleDeleteCommentAdmin(
                                                          review._id,
                                                          comment._id
                                                        )
                                                      : handleDeleteComment(
                                                          review._id,
                                                          comment._id
                                                        )
                                                  }
                                                >
                                                  Delete
                                                </p>
                                              </div>
                                            </>
                                          )}
                                      </div>
                                    ))}
                                {review.comments.length > visibleComments && (
                                  <p
                                    className="load-more-reviews text-muted text-center mb-4"
                                    style={{
                                      width: "100%",
                                    }}
                                    onClick={loadMoreComments}
                                  >
                                    Load More
                                  </p>
                                )}

                                <div className="add-comment mt-2">
                                  <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) =>
                                      setCommentText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddComment(review._id);
                                      }
                                    }}
                                    placeholder="Write a comment..."
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => handleAddComment(review._id)}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="review-actions mt-2 ">
                          {user &&
                            (user.existUser?._id === review?.userId?._id ||
                              user.existUser?.isAdmin) && ( 
                              <>
                                <div className="d-flex gap-1 ">
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEditClick(review)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      user.existUser?.isAdmin
                                        ? handleDeleteReviewAdmin(review._id)
                                        : handleDeleteReview(review._id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}

                  {reviews.length > visibleReviews && (
                    <p
                      className="load-more-reviews text-muted text-center"
                      onClick={loadMoreReviews}
                    >
                      Load More
                    </p>
                  )}
                  {user && (
                    <div className="add-review mt-3 mb-5">
                      <textarea
                        className="form-control"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a review..."
                      />
                      <RatingInput rating={rating} setRating={setRating} />
                      <button
                        className="btn btn-success mt-2 mx-2"
                        onClick={
                          editingReview ? handleEditReview : handleAddReview
                        }
                      >
                        {editingReview ? "Update Review" : "Add Review"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-3 col shadow detailShadow p-4 mt-2"
            style={{
              background: "#fff",
              borderRadius: "10px",
            }}
          >
            <h5>You may also like</h5>
            <div className="similar-products d-flex flex-column align-items-center">
              {products
                .filter(
                  (product) =>
                    product._id !== id &&
                    product.categories.some((category) =>
                      findProduct?.categories.includes(category)
                    )
                )
                .map((product) => (
                  <div key={product._id} className="similar-product-card  mt-4">
                    <div className="d-flex gap-2">
                      <div className=" similarImage">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.title}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(`/productdetail/${product._id}`)
                          }
                        />
                      </div>
                      <div>
                        <h6
                          style={{
                            fontWeight: "700",
                            maxWidth: "180px",
                          }}
                        >
                          {product.title}
                        </h6>
                        <p className="similarDescription">
                          {product.description.slice(0, 110) + " ..."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
