import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoutes = () => {
  const { authUser, loading } = useAuth();
  if (loading) return null;
  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
