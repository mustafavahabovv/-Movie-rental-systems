import "./App.css";
import "./i18n/i18n";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Wishlist from "./pages/wishlist/Wishlist";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgotpassword/ForgotPassword";
import Resetpassword from "./pages/auth/resetpassword/Resetpassword";
import Profile from "./pages/Profile/Profile";
import Create from "./pages/helpsupport/HelpSupport";
import ProtectAdmin from "./routes/protect/ProtectAdmin";
import UserProfile from "./pages/Profile/userProfile/UserProfile";
import Product from "./pages/Products/Product";
import Mystory from "./pages/MyStory/Mystory";
import ProtectedRoute from "./routes/ProtectRouter/ProtectedRoute";
import ProductDetail from "./pages/productdetail/ProductDetail";
import Alladmins from "./pages/Alladmins";
import ProtectLoginRegister from "./routes/ProtectLoginRegister";
import NotFoundPage from "./pages/notfoundPage/NotFoundPage";
import PaymentPage from "./pages/payment/PaymentPage";
import Loading from "./components/loading/Loading";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";


axios.defaults.withCredentials = true;

// 🧠 ROUTER
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/allproduct", element: <Product /> },
      { path: "/productdetail/:id", element: <ProductDetail /> },
      {
        element: <ProtectAdmin />,
        children: [{ path: "/admin", element: <Alladmins /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/wishlist", element: <Wishlist /> },
          { path: "/mystory", element: <Mystory /> },
          { path: "/profile", element: <Profile /> },
          { path: "/create", element: <Create /> },
          { path: "/userprofile", element: <UserProfile /> },
          { path: "/payment", element: <PaymentPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectLoginRegister />,
    children: [
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
  { path: "/resetpassword", element: <Resetpassword /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
]);

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading);

  // ✅ Başlanğıcda localStorage'dan darkMode oxunur
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ Səhifə refresh olanda body-yə uyğun class əlavə olunur
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const body = document.body;

    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, []);

  // ✅ darkMode dəyişəndə həm localStorage, həm də body class yenilənir
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ button ilə darkMode dəyiş
  return (
    <>
      {isLoading && <Loading />}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "23px",
          left: "20px",
          zIndex: 9999,
          padding: "10px 20px",
          borderRadius: "25px",
          backgroundColor: darkMode ? "#fff" : "#111",
          color: darkMode ? "#111" : "#fff",
          border: "none",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
