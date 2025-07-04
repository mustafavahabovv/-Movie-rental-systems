import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!user?.existUser?.isLogin) {
      toast.error("Please login first", { position: "top-right" });
      setRedirect(true);
    }
  }, [user]);

  if (redirect) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
