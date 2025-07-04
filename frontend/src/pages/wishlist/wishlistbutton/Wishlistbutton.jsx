import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToWishlist,
  removeFromWishlist,
  updateWishlistStatus,
} from "../../../redux/features/WishlistSlice";
import "./Wishlistbutton.css";
import { useTranslation } from "react-i18next";

const WishlistButtons = ({ productId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const userId = user?.existUser?._id;

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const wishlistItem = wishlist.find((item) => item?.product?._id === productId);
  const currentStatus = wishlistItem?.status || null;
  const wishlistItemId = wishlistItem?._id;

  useEffect(() => {
    if (showModal) {
      setSelectedStatus(currentStatus);
    }
  }, [showModal, currentStatus]);

  if (!userId) return null;

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleStatusChange = (status) => {
    if (currentStatus && currentStatus === status) {
      toast.info("This movie is already in your shelf with the selected status.");
      return;
    }

    if (currentStatus) {
      dispatch(updateWishlistStatus({ userId, productId, status }));
      toast.success("Movie status updated!");
    } else {
      dispatch(addToWishlist({ userId, productId, status }));
      toast.success("Movie added to List!");
    }

    setSelectedStatus(status);
    setShowModal(false);
  };

  const handleRemove = () => {
    if (wishlistItemId) {
      dispatch(removeFromWishlist(wishlistItemId));
      toast.success("Movie removed from List!");
    }
  };

  return (
    <>
      {showModal && (
        <div className="Wishlistmodal">
          <div className="modal-contentWishlist">
            <h2 className="mt-4">{t("chooseShelf")}</h2>
            <div className="d-flex flex-column gap-4 p-3">
              <button
                onClick={() => handleStatusChange("wantToRead")}
                className={selectedStatus === "wantToRead"
                  ? "customAdd btn btn-success"
                  : "customAdd btn btn-outline-success"}
              >
                {selectedStatus === "wantToRead"
                  ? `🍿 ${t("wantToBuy")}`
                  : t("wantToBuy")}
              </button>
              <button
                onClick={() => handleStatusChange("alreadyRead")}
                className={selectedStatus === "toBeBought"
                  ? "customAdd btn btn-success"
                  : "customAdd btn btn-outline-success"}
              >
                {selectedStatus === "wantToRead"
                  ? `🎬 ${t("toBeBought")}`
                  : t("toBeBought")}
              </button>

              {wishlistItem && (
                <button className="btn btn-light customRemove customAdd" onClick={handleRemove}>
                  {t("removeFromList")}
                </button>
              )}

              <button className="customClose " onClick={handleModalToggle}>
                X
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap">
        <button
          className={`btn wishlistbtn ${currentStatus === "wantToRead"
            ? "btn-outline-danger"
            : currentStatus === "toBeBought"
              ? "btn-outline-primary"
              : "btnx-dangerx"
            }`}
          onClick={handleModalToggle}
        >
          {currentStatus === "wantToBuy"
            ? "Want to buy"
            : currentStatus === "toBeBought"
              ? "To Be Bought"
              : "Add to List"}
        </button>
      </div>
    </>
  );
};

export default WishlistButtons;