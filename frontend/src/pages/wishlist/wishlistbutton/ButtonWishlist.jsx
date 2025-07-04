import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToWishlist, updateWishlistStatus } from "../../../redux/features/WishlistSlice";
import "./Wishlistbutton.css";
import axios from "axios"; // ✅ ADD: Stripe üçün lazım
import { useTranslation } from "react-i18next";


const ButtonWishlist = ({ productId }) => {
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const userId = user?.existUser?._id;

  const [selectedStatus, setSelectedStatus] = useState(null);

  const currentStatus = wishlist.find(item => item?.product?._id === productId)?.status || null;

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  if (!userId) return null;

  const handleStatusChange = (status) => {
    if (currentStatus && currentStatus === status) {
      toast.info("This book is already in your wishlist with the selected status.");
      return;
    }

    if (currentStatus) {
      dispatch(updateWishlistStatus({ userId, productId, status }));
      toast.success("Wishlist status updated!");
    } else {
      dispatch(addToWishlist({ userId, productId, status }));
      toast.success("Book added to wishlist!");
    }

    setSelectedStatus(status);
  };

  // ✅ ADD: Ödəniş funksiyası
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/payment/create-checkout-session", {
        product: {
          name: "Movie", // İstəyə uyğun olaraq kitab adı qoyula bilər
          price: 100, // 100 sent = 1 USD (dollarla qiymətləndir)
          quantity: 1
        }
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Ödəniş zamanı xəta:", error);
      toast.error("Ödəniş baş tutmadı.");
    }
  };

  return (
    <div className="d-flex gap-2 flex-wrap">
      <button
        onClick={() => handleStatusChange("wantToRead")}
        className={`btn ${selectedStatus === "wantToRead" ? "btn-success" : "btn-outline-success"}`}
      >
        {selectedStatus === "wantToRead"
          ? `✅ ${t("wantToBuy")}`
          : t("wantToBuy")}

      </button>

      <button
        onClick={() => {
          handleStatusChange("alreadyRead");
          handlePayment(); // ✅ Stripe ödənişini çağırırıq
        }}
        className={`btn ${selectedStatus === "alreadyRead" ? "btn-success" : "btn-outline-success"}`}
      >
        {selectedStatus === "alreadyRead"
          ? `✅ ${t("toBeBought")}`
          : t("toBeBought")}

      </button>
    </div>
  );
};

export default ButtonWishlist;
