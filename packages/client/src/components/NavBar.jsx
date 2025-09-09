import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FRONTEND_ROUTES } from "chattrance-shared";

import { useAuth } from "./AuthProvider";

function NavBar() {

  const { authUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate(FRONTEND_ROUTES.AUTH.LOGIN, { replace: true });
  }

  return (
    <header className="w-full px-6 py-4 border-b flex items-center justify-between">
      <div className="flex items-center">
        <img src="/CTLogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
        <h1 className="text-2xl font-extrabold" style={{ fontFamily: "Outfit" }}>
          Chattrance
        </h1>
      </div>

      {/* Hamburger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col h-6 w-6 justify-between items-center group"
        >
          <div className="h-1 w-6 bg-white transition" />
          <div className="h-1 w-6 bg-white transition" />
          <div className="h-1 w-6 bg-white transition" />
        </button>

        {isOpen && (
          <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg flex flex-col p-2 z-50">
            {authUser ? (
              <>
                <li className="block px-4 py-2 hover:bg-gray-200">
                  <Link to={FRONTEND_ROUTES.USER.ACCOUNT}>Account Info</Link>
                </li>
                <li className="block px-4 py-2 hover:bg-gray-200">
                  <Link to={FRONTEND_ROUTES.USER.SETTING}>Settings</Link>
                </li>
                <li className="block px-4 py-2 hover:bg-gray-200 text-red-600">
                  <button type="button" onClick={handleLogout} className="w-full text-left">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="block px-4 py-2 hover:bg-gray-200">
                  <Link to={FRONTEND_ROUTES.USER.SETTING}>Settings</Link>
                </li>
                <li className="block px-4 py-2 hover:bg-gray-200">
                  <Link to={FRONTEND_ROUTES.AUTH.LOGIN}>Log In</Link>
                </li>
                <li className="block px-4 py-2 hover:bg-gray-200">
                  <Link to={FRONTEND_ROUTES.HOME}>Back to Home</Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </header>
  );

}

export default NavBar;