import React, { useState } from "react";

function MainMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center">
          <img src="/CTlogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "Outfit" }}>
            Chattrance
          </h1>
        </div>

        {/* Right: Hamburger + Dropdown */}
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
              <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Account</li>
              <li className="hover:bg-gray-200 px-4 py-2 cursor-pointer">Settings</li>
              <li className="hover:bg-gray-200 text-red-600 px-4 py-2 cursor-pointer">Sign Out</li>
            </ul>
          )}
        </div>
      </div>

      {/* Centered Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h2 className="text-3xl text-white font-medium" style={{ fontFamily: 'Outfit' }}>
            Welcome to Chattrance
          </h2>
          <h3 className="text-xl text-white font-extralight mb-2" style={{ fontFamily: 'Outfit' }}>
            Chat smarter, faster, and cooler with Chattrance — your go-to place <br />
            for real-time conversations that just flow. Ready to dive in?
          </h3>
          <button className="px-6 py-2 mt-4 bg-blue-600 text-white rounded" style={{ fontFamily: 'Outfit' }}>
            Start Chat
          </button>
          <button className="px-6 py-2 bg-gray-300 text-black rounded" style={{ fontFamily: 'Outfit' }}>
            Join Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
