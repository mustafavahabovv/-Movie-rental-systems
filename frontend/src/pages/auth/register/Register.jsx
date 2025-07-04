import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { registerschema } from "../../../schema/RegisterSchema";
// import CheckMail from "../../../components/checkMail/CheckMail";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Register = () => {
  const baseUrl = "http://localhost:5000/auth";

  const submitForm = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);

      await axios.post(`${baseUrl}/register`, formData, {
        withCredentials: true,
      });

      actions.resetForm();
      toast.info("Please check your email to verify your account.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Registration failed:", error);
    }
  };

  const { values, handleChange, handleSubmit, setFieldValue, errors } =
    useFormik({
      initialValues: {
        image: "",
        name: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      },
      onSubmit: submitForm,
      validationSchema: registerschema,
    });

  return (
    <div className="container">
      <form
        encType="multipart/form-data"
        action=""
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h3>Register</h3>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            className="form-control"
            onChange={(e) => setFieldValue("image", e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <div className="text-danger">{errors.name}</div>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            onChange={handleChange}
            value={values.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="text-danger">{errors.username}</div>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            onChange={handleChange}
            value={values.username}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="text-danger">{errors.email}</div>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={values.email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="text-danger">{errors.password}</div>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            value={values.password}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className="text-danger">{errors.confirmpassword}</div>
          <input
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            className="form-control"
            onChange={handleChange}
            value={values.confirmpassword}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Sign-Up
        </button>

        <span>
          Already have an account? <a href="/login">Login</a>
        </span>
      </form>
    </div>
  );
};

export default Register;
