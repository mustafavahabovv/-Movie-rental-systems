import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProduct } from "../../redux/features/ProductSlice";
import { MdNavigateNext } from "react-icons/md";
import ReactPaginate from "react-paginate";
import "./Product.css";
import { useTranslation } from "react-i18next";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();

  const productsPerPage = 8;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchRatings = async () => {
      const reviewsData = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/reviews/${product._id}`,
              { withCredentials: true }
            );
            const reviewData = response.data;

            const averageRating =
              reviewData.reviews.length > 0
                ? reviewData.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / reviewData.reviews.length
                : 0;

            reviewsData[product._id] = {
              rating: averageRating,
              reviewCount: reviewData.reviews.length,
            };
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        })
      );
      setReviews(reviewsData);
    };

    if (products.length > 0) fetchRatings();
  }, [products]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set([
        ...products.flatMap((p) => p.categories),
        "Action",
        "Drama",
        "Comedy",
        "Sport"
      ])
    ];
    setCategories(uniqueCategories);
  }, [products]);


  useEffect(() => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        p.categories.some((c) => selectedCategories.includes(c))
      );
    }

    if (selectedRating > 0) {
      filtered = filtered.filter(
        (p) => reviews[p._id] && reviews[p._id].rating >= selectedRating
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(0);
  }, [selectedCategories, selectedRating, products, reviews]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFiltersCate = () => {
    setSelectedCategories([]);
  };

  const resetFiltersRate = () => {
    setSelectedRating(0);
  };

  const goBack = () => {
    navigate(-1);
  };

  const offset = currentPage * productsPerPage;
  const paginatedProducts = filteredProducts.slice(offset, offset + productsPerPage);
  const itemsPerPage = 8;
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mt-5">
      <div className="d-flex mb-2 align-items-center gap-2" style={{ marginTop: "110px" }}>
        <div>
          <div className="backHover" onClick={goBack}>{t("back")}</div>
        </div>
        <MdNavigateNext />
        <h2>{t("allMovies")}</h2>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-sm-12 mt-3">
            <div className="shadow filterArea p-3">
              <div className="filterInputArea">
                <input
                  type="text"
                  onChange={(e) => dispatch(searchProduct(e.target.value))}
                  className="filterInput form-control"
                  placeholder="Filter by title.."
                />
              </div>
              <div className="filterCat mt-3">
                <h5>{t("filterByCategories")}</h5>
                {categories.map((category) => (
                  <div key={category} className="form-check">
                    <input
                      type="checkbox"
                      id={category}
                      onChange={() => handleCategoryChange(category)}
                      checked={selectedCategories.includes(category)}
                      className="form-check-input"
                    />
                    <label htmlFor={category} className="form-check-label ms-2">
                      {category}
                    </label>
                  </div>
                ))}
                <div className="text-end">
                  <button className="btn btn-sm btn-danger" onClick={resetFiltersCate}>
                    {t("reset")}
                  </button>
                </div>
              </div>

              <div className="filterRate mt-3">
                <h5>{t("filterByCategories")}</h5>
                <div className="d-flex align-items-center justify-content-between">
                  <StarRatings
                    rating={selectedRating}
                    starRatedColor="gold"
                    changeRating={setSelectedRating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="20px"
                    starSpacing="5px"
                  />
                  <button className="btn btn-sm btn-danger" onClick={resetFiltersRate}>
                    {t("reset")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-8 col-sm-12">
            <div className="row g-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <div className="card h-100 shadow-sm">
                      <div className="imageAll">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          className="card-img-top img-fluid"
                          alt={product.name}
                          onClick={() => navigate(`/productdetail/${product._id}`)}
                          style={{ cursor: "pointer", objectFit: "cover", height: "290px" }}
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title" style={{ height: "50px" }}>
                          {product.title}
                        </h5>
                        <p className="card-text">
                          {product.categories.join(", ")}
                        </p>
                        <div className="d-flex gap-1">
                          <StarRatings
                            rating={reviews[product._id]?.rating || 0}
                            starRatedColor="gold"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="1px"
                          />
                          <span>({reviews[product._id]?.rating?.toFixed(1) || "0.0"})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">{t("noProductsFound")}</p>
              )}
            </div>

            {pageCount > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={(data) => setCurrentPage(data.selected)}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
