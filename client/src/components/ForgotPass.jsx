import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ROUTES } from '../shared/endpoints';

function ForgotPass() {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await fetch(`/api/${API_ROUTES.REQUEST_RESET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  const isLoggedIn = false;
  const handleLogout = async () => {
    console.log("Logged out");
    navigate(LOGIN);
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
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
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col h-6 w-6 justify-between items-center group"
          >
            <div className="h-1 w-6 bg-white transition" />
            <div className="h-1 w-6 bg-white transition" />
            <div className="h-1 w-6 bg-white transition" />
          </button>

          {isOpen && (
            <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg flex flex-col p-2 z-50">
              {isLoggedIn ? (
                <>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/account">Account Info</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200 text-red-600">
                    <button
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
      </div>
      {/* Reset Password frame */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center justify-center text-center font-mono p-20 gap-8 bg-white rounded-2xl">
          <div className="text-4xl font-extrabold underline">Reset Password</div>
          <div className="text-2xl font-bold text-gray-400">Provide the email address associated with your account to recover your password</div>
          <div className="flex flex-col text-2xl text-left gap-1">
            <span>Email</span>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)}
            className="rounded-md p-1 border-2 outline-none text-black focus:border-blue-400 focus:bg-slate-500" />
            <button
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-700 mt-3 text-white rounded px-4 py-2">Reset Password</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPass;
