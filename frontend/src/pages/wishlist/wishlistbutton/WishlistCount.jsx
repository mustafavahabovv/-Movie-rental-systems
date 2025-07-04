import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const WishlistCount = ({ productId }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const filteredWishlist = wishlist.filter((item) => item.product._id === productId);
    setCount(filteredWishlist.length);
  }, [wishlist, productId]);

  return (
    <div className="wishlist-count">
      <p>{count} {t("addedToWishlist")}</p>
    </div>
  );
};

export default WishlistCount;
