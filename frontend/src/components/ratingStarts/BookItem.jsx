import React from "react";
import RatingStars from "./RatingStars"; 

const BookItem = ({ item, reviews }) => {
  const rating = reviews[item.product._id]
    ? reviews[item.product._id].rating
    : null;

  return (
    <div className="book-item">
      <h3>{item.product.title}</h3>
      
      <div>
        {rating ? (
          <>
            <RatingStars rating={rating} />
            <p>{rating.toFixed(1)} / 5</p> 
          </>
        ) : (
          <p>N/A</p>
        )}
      </div>
    </div>
  );
};

export default BookItem;
