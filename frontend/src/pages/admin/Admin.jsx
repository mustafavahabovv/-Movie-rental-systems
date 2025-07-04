import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  getProducts,
  deleteProduct,
  searchProduct,
  addProduct,
  updateProduct,
  sortProductAZ,
  sortProductZA,
} from "../../redux/features/ProductSlice";
import CategorySelect from "../../components/catSelect/CategorySelect";
import RatingInput from "../../components/catSelect/RatingInput";
import { productSchema } from "../../schema/ProductCreateSchema";
import Table from "react-bootstrap/Table";
import "./Admin.scss";
import { SlClose } from "react-icons/sl";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        products.filter((product) =>
          product.categories.includes(selectedCategory)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (editProductId) {
      const product = products.find((p) => p._id === editProductId);
      if (product) {
        setPreviewImage(`http://localhost:5000/${product.image}`);
      }
    }
  }, [editProductId, products]);

  const {
    values,
    handleChange,
    setFieldValue,
    errors,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: {
      image: null,
      title: editProductId
        ? products.find((p) => p._id === editProductId)?.title || ""
        : "",
      description: editProductId
        ? products.find((p) => p._id === editProductId)?.description || ""
        : "",
      author: editProductId
        ? products.find((p) => p._id === editProductId)?.author || ""
        : "",
      categories: editProductId
        ? products.find((p) => p._id === editProductId)?.categories || []
        : [],

    },
    validationSchema: productSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("author", values.author);
      selectedCategories.forEach((cat) => {
        formData.append("categories[]", cat.value);
      });

      try {
        if (editProductId) {
          await dispatch(
            updateProduct({ id: editProductId, updatedData: formData }),
            toast.success("Book status updated!")
          );
        } else {
          await dispatch(addProduct(formData));
          toast.success("Book created succesfuly!")
        }
        resetForm();
        setOpen(false);
        setEditProductId(null);
        setPreviewImage("");
        setSelectedCategories([]);
      } catch (error) {
        console.error("❌ Error:", error);
      }
    },
  });

  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setSelectedCategories(
      product.categories.map((cat) => ({ value: cat, label: cat }))
    );
    setFieldValue("image", product.image);
    setFieldValue("title", product.title);
    setFieldValue("description", product.description);
    setFieldValue("author", product.author);

    setFieldValue("categories", product.categories);
    setOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setOpen(false);
    setEditProductId(null);
    setPreviewImage("");
    setSelectedCategories([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("image", file);
    }
  };

  return (
    <div className="container" style={{
      minHeight: "100vh",
    }}>
      {open && (
        <>
          <div
            className="overlay"
            onClick={handleCloseForm}
          ></div>

          <form
            encType="multipart/form-data"
            className="form"
            onSubmit={handleSubmit}
          >
            <div className="d-flex justify-content-between">
              <h3>{editProductId ? "Edit Book" : "Create Book"}</h3>

              <SlClose onClick={handleCloseForm} className="customXBTN" />
            </div>
            <div className="form-group">
              <label htmlFor="image">{t("image")}</label>
              <div className="text-danger">{errors.image}</div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Current Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              )}

              <input
                type="file"
                id="image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">{t("title")}</label>
              <div className="text-danger">{errors.title}</div>
              <input
                type="text"
                id="title"
                className="form-control"
                onChange={handleChange}
                value={values.title}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">{t("description")}</label>
              <div className="text-danger">{errors.description}</div>
              <textarea
                id="description"
                className="form-control"
                onChange={handleChange}
                value={values.description}
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">{t("cast")}</label>
              <div className="text-danger">{errors.author}</div>
              <input
                type="text"
                id="author"
                className="form-control"
                onChange={handleChange}
                value={values.author}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categories">{t("categories")}</label>
              <div className="text-danger">{errors.categories}</div>
              <CategorySelect
                categories={[
                  "Romance",
                  "Fantasy",
                  "Horror",
                  "Mystery",
                  "Action",
                  "Drama",
                  "Comedy",
                  "Sport",
                ]}

                selectedCategories={selectedCategories}
                setSelectedCategories={(categories) => {
                  setSelectedCategories(categories);
                  setFieldValue(
                    "categories",
                    categories.map((cat) => cat.value)
                  );
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {editProductId ? "Update" : "Add"}
            </button>
          </form>
        </>
      )}

      <div className="mb-2 d-flex justify-content-between flex-wrap gap-2">
        <button
          className="btn btn-success"
          onClick={() => {
            if (editProductId) {
              resetForm();
              setEditProductId(null);
              setPreviewImage("");
              setSelectedCategories([]); // Formun açılıb-bağlanmasını idarə et
            }
            setOpen(!open);
          }}
        >
          {editProductId ? "Cancel" : "Create"}
        </button>

        <input
          type="text"
          onChange={(e) => dispatch(searchProduct(e.target.value))}
          className="form-control w-auto flex-grow-1"
          placeholder="Search products"
        />

        <div className="d-flex gap-2 flex-wrap justify-content-between" >
          <Dropdown className="">
            <Dropdown.Toggle variant="secondary" id="categoryFilter">
              {selectedCategory ? selectedCategory : "Filter by Category"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedCategory("")}>
                {t("allCategories")}
              </Dropdown.Item>
              {["Romance", "Horror", "Fantasy", "Mystery",].map((cat, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {t("filterByTitle")}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1" onClick={() => dispatch(sortProductAZ())}>
                {t("aToZ")}
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={() => dispatch(sortProductZA())}>
                {t("zToA")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Table striped bordered hover responsive="lg">
        <thead>
          <tr>
            <th>{t("image")}</th>
            <th>{t("title")}</th>
            <th>{t("category")}</th>

            <th>{t("author")}</th>
            <th>{t("description")}</th>
            <th>{t("setting")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts &&
            filteredProducts.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={`http://localhost:5000/${item.image}`}
                    alt=""
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                  />
                </td>
                <td>{item.title}</td>
                <td>
                  {item.categories?.map((cat, index) => (
                    <div className="d-flex" key={index}>
                      {cat}
                    </div>
                  ))}
                </td>
                <td>{item.author}</td>
                <td>{item.description.slice(0, 100) + "..."}</td>
                <td className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditProduct(item)}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => { dispatch(deleteProduct(item._id)), toast.success("Book deleted!") }}
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>

  );
};

export default Admin;
