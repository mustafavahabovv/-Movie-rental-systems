import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectLoginRegister = () => {
  const { user } = useSelector((state) => state.user);

  return user?.existUser?.isLogin ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectLoginRegister;
