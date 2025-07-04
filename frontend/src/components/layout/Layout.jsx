import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import Chat from "../../pages/chat/Chat";
import { useSelector, useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../redux/features/LoadingSlice";
import Loading from "../loading/Loading";

const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.loading);

  const hiddenRoutes = ["/register", "/login", "/resetpassword", "/forgotpassword", "/admin"];

  const isUserLoggedIn = user && user?.existUser?.isLogin;

  useEffect(() => {
    dispatch(startLoading());
    const timer = setTimeout(() => {
      dispatch(stopLoading());
    }, 600); // istəsən saniyəni dəyişə bilərsən
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div>
      {isLoading && <Loading />}
      <Header />
      <Outlet />
      {!hiddenRoutes.includes(location.pathname) && isUserLoggedIn && <Chat />}
      <Footer />
    </div>
  );
};

export default Layout;
