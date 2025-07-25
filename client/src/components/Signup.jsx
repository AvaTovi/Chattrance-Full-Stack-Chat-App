import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StatusCodes } from 'http-status-codes';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Signup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const isLoggedIn = false; // placeholder
  const handleLogout = () => {
    console.log("Logged out");
    navigate("/login");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      setMessage(`${data.message}`);
      if (response.status === StatusCodes.CREATED) {
        setTimeout(() => {
          setMessage('Redirecting...');
        }, 1000);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occured');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center">
          <img src="/CTlogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-2xl text-white font-extrabold" style={{ fontFamily: "Outfit" }}>
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
                    <button onClick={handleLogout} className="w-full text-left">
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
                    <Link to="/login">Sign In</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-200">
                    <Link to="/signup">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Signup screen */}
      <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-400 via-50% to-orange-400 to-100%">
        <div className="flex shadow-2xl">
          <div className="flex flex-col items-center text-center p-20 gap-8 bg-white rounded-2xl w-full">
            <h1 className="text-5xl font-bold">Create Account</h1>
            {/* Username */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
            </div>
            {/* Password */}
            <div className="flex flex-col text-2xl text-left gap-1 relative">
              <span>Password</span>
              <div className="flex w-full items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md pt-1 pb-1 pl-1 pr-9 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2 ml-2 text-blue-500 hover:text-blue-700"
                >
                  {showPassword ? <FiEye size={24} /> : <FiEyeOff size={24} />}
                </button>
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
            </div>
            {/* Remember password button */}
            <div className="flex gap-1 items-center">
              <input type="checkbox" />
              <span className="text-base">Remember Password</span>
            </div>

            {message && <p className="text-red-600 font-semibold">{message}</p>}

            {/* Sign Up Button */}
            <div>
              <button
                onClick={handleSignup}
                className="px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white">Sign Up</button>
            </div>
            <div className="mt-1">
              <a href="/" className="text-blue-400 mt-5 underline hover:underline">Back to Main Menu</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
