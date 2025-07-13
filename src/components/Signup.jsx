import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
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
            <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg flex flex-col space-y-2 p-2 z-50">
              <li>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="block px-4 py-2 hover:bg-gray-200">Sign Up</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Signup screen */}
      <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-400 via-50% to-orange-400 to-100%">
        <div className="flex shadow-2xl">
          <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl">
            <h1 className="text-5xl font-bold">Create Account</h1>
            {/* Username */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Username</span>
              <input type="text" className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
            </div>
            {/* Password */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Password</span>
              <input type="text" className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
            </div>
            {/* Email */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Email</span>
              <input type="text" className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500" />
            </div>
            {/* Remember password putton */}
            <div className="flex gap-1 items-center">
              <input type="checkbox" />
              <span className="text-base">Remember Password</span>
            </div>

            {/* Login Button */}
            <div>
              <button className="px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white">Login</button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
