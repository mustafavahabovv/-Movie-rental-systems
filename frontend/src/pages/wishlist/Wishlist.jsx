import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserWishlist,
  removeFromWishlist,
} from "../../redux/features/WishlistSlice";
import ButtonWishlist from "./wishlistbutton/ButtonWishlist";
import "./Wishlist.css";
import axios from "axios";
import RatingStars from "../../components/ratingStarts/RatingStars";
import { Link, useNavigate } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import StarRatings from "react-star-ratings";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch, wishlist.length]);

  useEffect(() => {
    wishlist.forEach(async (item) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${item.product._id}`,
          { withCredentials: true }
        );
        const reviewData = response.data;

        const averageRating =
          reviewData.reviews && reviewData.reviews.length > 0
            ? reviewData.reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            ) / reviewData.reviews.length
            : 0;

        setReviews((prevReviews) => ({
          ...prevReviews,
          [item.product._id]: {
            rating: averageRating,
            reviewCount: reviewData.reviews.length,
          },
        }));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    });
  }, [wishlist]);

  const handleRemove = (wishlistId) => {
    dispatch(removeFromWishlist(wishlistId));
  };

  const filteredWishlist =
    filter === "all"
      ? wishlist
      : wishlist.filter((item) => item.status === filter);

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="container mt-5" >
      <div className="row ">
        <div className="d-flex mb-1  align-items-center gap-2" style={{ marginTop: "70px" }}>
          <div>
            <div className="backHover" onClick={goBack}>
              {" "}
              {t("back")}
            </div>
          </div>
          <MdNavigateNext />
          <h2>{t("movieList")}</h2> 
        </div>
        <div className="col-md-3">
          <div className="wishlist-sidebar p-3">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              🍿 {t("movies")}
            </button>
            <button
              className={`filter-btn ${filter === "wantToRead" ? "active" : ""
                }`}
              onClick={() => setFilter("wantToRead")}
            >
              🎬 {t("wantToBuy")}
            </button>
            <button
              className={`filter-btn ${filter === "alreadyRead" ? "active" : ""
                }`}
              onClick={() => setFilter("alreadyRead")}
            >
              ✅ {t("toBeBought")}
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {filteredWishlist.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                fontSize: "30px",
              }}
            >
              {t("noMoviesFound")} 😢
            </p>
          ) : (
            <div className="wishlist-items d-flex flex-column gap-3">
              {filteredWishlist.map((item) => (
                <div key={item._id} className="wishlist-item row p-3">
                  <div className="col-sm-2">
                    <img
                      style={{
                        width: "100%",
                        cursor: "pointer",
                      }}
                      src={`http://localhost:5000/${item?.product?.image}`}
                      alt={item?.product?.title}
                      className="wishlist-img"
                      onClick={() =>
                        navigate(`/productdetail/${item?.product?._id}`)
                      }
                    />
                  </div>
                  <div className="col-sm-10 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between ">
                      <h3
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {item?.product?.title}
                      </h3>
                    </div>
                    <p>{t("author")}: {item?.product?.author}</p>
                    <div className="d-flex gap-1 align-items-center ">
                      {t("rating")}:{" "}
                      {reviews[item.product._id] ? (
                        <>
                          <div className="d-flex gap-1 align-items-center ">
                            <StarRatings
                              rating={reviews[item?.product?._id].rating}
                              starRatedColor="gold"
                              numberOfStars={5}
                              starDimension="20px"
                              starSpacing="1px"
                            />
                            <div>
                              ({reviews[item?.product?._id].rating.toFixed(1)})
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    <p style={{ color: "#595959", marginTop: "5px" }}>
                      {item?.product?.description?.length > 300
                        ? item?.product?.description.slice(0, 300) + "..."
                        : item?.product?.description}
                    </p>
                    <div
                      className="d-flex gap-2 justify-content-between"
                      style={{
                        color: "#595959",
                      }}
                    >
                      <p className="d-flex gap-1">
                        {t("categories")}
                        {item?.product?.categories.map((cat, index) => (
                          <span key={index}>{cat}</span>
                        ))}
                      </p>
                      <p>
                        {t("added")}:{" "}
                        {new Date(item.addedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                      <ButtonWishlist productId={item?.product?._id} />
                      <button
                        className="btn btn-danger"
                        onClick={() => { handleRemove(item._id), toast.success("Book removed from shelf!") }}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
