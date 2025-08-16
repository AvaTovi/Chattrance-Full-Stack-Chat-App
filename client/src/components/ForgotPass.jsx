import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../shared/endpoints";
import { useAuth } from "./AuthProvider";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { authUser, requestReset, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    const res = await requestReset(email);
    setMessage(res.message);
  };

  const handleLogout = async () => {
    await logout();
    navigate(FRONTEND_ROUTES.LOGIN);
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
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

        {/* Hamburger Menu */}
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
                    <Link to="/account">Account Info</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200 text-red-600">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/">Back to Home</Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </header>
      {/* Reset Password frame */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center justify-center text-center font-mono p-20 gap-8 bg-white rounded-2xl">
          <div className="text-4xl font-extrabold underline">
            Reset Password
          </div>
          <div className="text-2xl font-bold text-gray-400">
            Provide the email address associated with your account to recover
            your password
          </div>
          <div className="flex flex-col text-2xl text-left gap-1">
            <span>Email</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md p-1 border-2 outline-none text-black focus:border-blue-400 focus:bg-slate-500"
            />
            <button
              type="button"
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-700 mt-3 text-white rounded px-4 py-2"
            >
              Reset Password
            </button>
          </div>
          {message && <p className="text-red-600 font-semibold">{message}</p>}
        </div>
      </section>

    </div>
  );
}

export default ForgotPass;
