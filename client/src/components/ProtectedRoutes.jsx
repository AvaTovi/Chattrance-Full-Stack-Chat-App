import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoutes = () => {
    const { authUser, loading } = useAuth();
    isLoggedIn = Boolean(authUser);
    if (loading) return null;
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;