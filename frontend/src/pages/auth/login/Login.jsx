import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { loginschema } from "../../../schema/LoginSchema";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../../redux/features/userSlice";
import "react-toastify/dist/ReactToastify.css"; 
import { toast } from "react-toastify";

const Login = () => {
  const baseUrl = "http://localhost:5000/auth";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitForm = async (values, actions) => {
    try {
      const res = await axios.post(`${baseUrl}/login`, values, {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(setUser(res.data));
        toast.success(res.data.message);
        
      } else {
        toast.error("Login failed");
      }

      actions.resetForm();

      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      // console.error("Login failed:", error);
    }
  };

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: submitForm,
    validationSchema: loginschema,
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
        <h3>Login</h3>

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
        <span>
          <Link to="/forgotpassword">Forgot password?</Link>
        </span>

        <button type="submit" className="btn btn-primary">
          Sign-In
        </button>

        <span>
          Don't have an account? <Link to="/register">register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
