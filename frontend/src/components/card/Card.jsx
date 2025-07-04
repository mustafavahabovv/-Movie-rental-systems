import React, { useEffect, useState } from "react";
import "./Card.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Card = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.wishlist);

  const [color, setColor] = useState(false);

  const findProduct = wishlist.find((item) => item._id === product._id);

  useEffect(() => {
    setColor(!!findProduct);
  }, [wishlist, color]);

  return (
    <div className="">
      <div className="cards">
          <div className="image">
            <img
              src={`http://localhost:5000/${product.image}`}
              alt=""
              onClick={() => navigate(`/productdetail/${product._id}`)}
            />
          </div>
          <div className="content">
            <div className="card-rating d-flex gap-2">
              {product?.categories.map((cat, index) => (
                <span key={index}>{cat}</span>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Card;
