import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getProducts } from "../../redux/features/ProductSlice";
import { useFormik } from "formik";
import CategorySelect from "../../components/catSelect/CategorySelect";
import RatingInput from "../../components/catSelect/RatingInput";
import { FaCloudUploadAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import "./HelpSupport.scss";
import { productSchema } from "../../schema/ProductCreateSchema";

const Create = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setFieldValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const { values, handleChange, setFieldValue, errors, resetForm } = useFormik({
    initialValues: {
      image: null,
      title: "",
      description: "",
      author: user?.existUser?.username || "",
      categories: [],

    },
    validationSchema: productSchema,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Form Submit oldu!");

    const formData = new FormData();
    if (values.image) {
      formData.append("image", values.image);
    }

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("author", values.author);
    selectedCategories.forEach((cat) => {
      formData.append("categories[]", cat.value);
    });

    console.log(Object.fromEntries(formData));
    if (!values.title) {
      toast.error("Title is required");
      return;
    }
    if (!values.description) {
      toast.error("Description is required");
      return;
    }



    try {
      const response = await dispatch(addProduct(formData)); // ✅ məhsulu əlavə et
      await dispatch(getProducts()); // ✅ məhsullar siyahısını yenilə

      console.log(response);
      resetForm();
      setOpen(false);
      setPreviewImage(null);
      setSelectedCategories([]);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5" >
      <div style={{ marginTop: "110px" }}></div>
      <form
        encType="multipart/form-data"
        className=""
        onSubmit={handleFormSubmit}
      >
        <div className="row">
          <div className="col-md-3 mt-3">
            <div className="form-group">
              <div
                className="image-upload-wrapper"

              >
                <div className="image-error">{errors.image}</div>

                <input
                  type="file"
                  id="image"
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <label
                  htmlFor="image"
                  className="btn btn-primary d-flex flex-column align-items-center justify-content-center"
                  style={{
                    width: "90px",
                    height: "80px",
                    background: "#444",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <FaCloudUploadAlt size={30} />
                </label>


                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="position-absolute top-0 start-0 w-100 h-100 rounded"
                    style={{ objectFit: "contain", zIndex: 1 }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-9 mt-3">
            <div className="shadow">
              <div className="storyStart">
                <h4>Support</h4>

                <div className="line"></div>
              </div>
              <div className="form-groupCreate">
                <label htmlFor="author">User</label>
                <div className="text-danger">{errors.author}</div>
                <input
                  type="text"
                  id="author"
                  className="form-control"
                  onChange={handleChange}
                  value={values.author}
                  readOnly
                />
              </div>
              <div className="form-groupCreate">
                <label htmlFor="title">Title</label>
                <div className="text-danger">{errors.title}</div>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  onChange={handleChange}
                  value={values.title}
                />
              </div>
              <div className="form-groupCreate">
                <label htmlFor="description">Description</label>
                <div className="text-danger">{errors.description}</div>
                <textarea
                  id="description"
                  className="form-control"
                  onChange={handleChange}
                  value={values.description}
                />
              </div>


              <div
                className="form-groupCreate "
                style={{ marginTop: "20px", paddingBottom: "20px" }}
              >
                <button type="submit" className="btn btn-success">
                  Send for review
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;