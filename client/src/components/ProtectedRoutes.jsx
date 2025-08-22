import { SpinningCircles } from "react-loading-icons";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoutes = () => {
  const { authUser, loading } = useAuth();
  const location = useLocation();

  // allow /anything?dev=1 (or env flag) during development
  const params = new URLSearchParams(location.search);
  const devBypass =
    params.get("dev") === "1" ||
    process.env.REACT_APP_DEV_LOBBY_BYPASS === "1";

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-black">
        <header className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/CTlogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
            <h1 className="text-2xl text-white font-extrabold" style={{ fontFamily: "Outfit" }}>
              Chattrance
            </h1>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <SpinningCircles />
          <span className="ml-2 text-white text-3xl">Loading</span>
        </div>
      </div>
    );
  }

  if (authUser || devBypass) return <Outlet />;

  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
