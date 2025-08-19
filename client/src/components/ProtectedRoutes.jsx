import { SpinningCircles } from "react-loading-icons";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./AuthProvider";

const ProtectedRoutes = () => {
  const { authUser, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex flex-col bg-black">
      {/** Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center">
          <img src="/CTlogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
          <h1
            className="text-2xl text-white font-extrabold"
            style={{ fontFamily: "Outfit" }}
          >
            Chattrance
          </h1>
        </div>
      </header>
      <div className="flex flex-1 height-full width-full items-center justify-center">
        <SpinningCircles />
        <span className=" ml-2 text-white text-3xl">Loading</span>
      </div>
    </div>
  );
  return authUser ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoutes;
