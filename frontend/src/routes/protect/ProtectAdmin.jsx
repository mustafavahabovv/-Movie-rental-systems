import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectAdmin = () => {
  const { user } = useSelector((state) => state.user);

  return user?.existUser?.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectAdmin;