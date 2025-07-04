import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/features/userSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NewRelases.css";
import { useTranslation } from "react-i18next";

const NewReleases = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { t } = useTranslation();
  const allUsers = users?.users;

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const sortedProducts = products
    ? [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    : [];

  const filteredProducts = sortedProducts.filter(
    (product) => !allUsers?.some((user) => user.name === product.author)
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let descriptionLength = 100500;
  if (window.innerWidth < 768) {
    descriptionLength = 300;
  }
  return (
    <div className="mt-2 releases-section shadow">
      <div className="container">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
          className="newH"
        >
          {t("newReleases")}
        </h1>
        <div className="">
          <Slider {...settings}>
            {filteredProducts.slice(0, 2).map((product) => (
              <div
                key={product._id}
                style={{ display: "flex ", alignItems: "center" }}
              >
                <div className=" releaseStart">
                  <div className="releaseImage">
                    <img
                      src={`http://localhost:5000/${product.image}`}
                      alt={product.title}
                      className="releaseImg"
                    />
                  </div>

                  <div className="releaseDetail">
                    <h2 className="releaseHead">{product.title}</h2>
                    <div className="releasDes">
                      {product.description.slice(0, descriptionLength)}
                    </div>
                    <div className="d-flex justify-content-between releasDes mediaCateDate">
                      <div className="d-flex gap-1">
                        Categories:
                        {product.categories.map((cat, index) => (
                          <div key={index}>{cat}</div>
                        ))}
                      </div>

                      <p>
                        Added:
                        {new Date(product.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
