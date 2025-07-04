import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/ProductSlice";
import Card from "../card/Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Releated = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const favoriteCategories = user?.existUser?.favCategories || [];

  let displayedProducts =
    favoriteCategories.length > 0
      ? products.filter((product) =>
          product.categories.some((category) =>
            favoriteCategories.includes(category)
          )
        )
      : products; 

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container ">
      <div className="row mt-5">
        <div className="d-flex justify-content-between mb-2">
          <h3>Recommended</h3>
          <Link to={"/allproduct"} className="d-flex align-items-center  ">
            view all
            <MdNavigateNext />
          </Link>
        </div>
        <Slider {...settings}>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product._id} className="">
                <Card product={product} />
              </div>
            ))
          ) : (
            <>
                {products.map((product) => (
                  <div key={product._id}>
                    <Card product={product} />
                  </div>
                ))}
            </>
          )}
        </Slider>
      </div>
    </div>
  );
};

export default Releated;
