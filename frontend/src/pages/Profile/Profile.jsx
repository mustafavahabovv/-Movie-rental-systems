import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogout, setUser } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.scss";
import { FaPenAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";


const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.existUser?.name || "");
  const [username, setUsername] = useState(user?.existUser?.username || "");
  const [email, setEmail] = useState(user?.existUser?.email || "");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.existUser?.image ? `http://localhost:5000/${user.existUser.image}` : "/default-avatar.png"
  );

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        dispatch(setUser(res.data));
        setName(res.data.name);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setPreviewImage(`http://localhost:5000/${res.data.image}`);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="container mt-5">
      <div className="profile-container">
        <div className="profile-details">
          <div className="profile-update">
            <h3 className="text-center">{t("profile")}</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="profileDeatils">
                <div className="profile-image-wrapper">
                  <label htmlFor="fileUpload" className="profile-image-label">
                    <img
                      src={previewImage}
                      alt={user?.existUser?.username}
                      className="profile-image"
                    />
                    <div className="edit-icon">
                      <FaPenAlt />
                    </div>
                  </label>

                  <input
                    type="file"
                    id="fileUpload"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div>
                <div className="profilText">{t("name")}</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="profilInput"
                />
              </div>
              <div>
                <div className="profilText">{t("username")}</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="profilInput"
                />
              </div>
              <div>
                <div className="profilText">{t("email")}</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="profilInput"
                />
              </div>

              <button type="submit">{t("updateProfile")}</button>
            </form>
          </div>

          <div className="d-flex gap-2 justify-content-between align-items-center mt-2 flex-wrap">
            <div>
              <div className="password-reset">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/forgotpassword")}
                >
                  {t("resetPassword")}
                </button>
              </div>
            </div>

            <div className="logout">
              <button
                className="btn btn-danger"
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/login");
                }}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
