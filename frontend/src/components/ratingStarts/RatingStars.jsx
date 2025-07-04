import React from "react";
import "./RatingStars.css"

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating); 
  const halfStar = rating % 1 >= 0.5; 
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 

  return (
    <div className="rating-stars">
      {[...Array(fullStars)].map((_, index) => (
        <span key={index} className="star full">★</span>
      ))}
      
      {halfStar && <span className="star half">★</span>}
      
      {[...Array(emptyStars)].map((_, index) => (
        <span key={index} className="star empty">☆</span>
      ))}
    </div>
  );
};

export default RatingStars;
