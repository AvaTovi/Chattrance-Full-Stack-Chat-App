import React, { useEffect, useState } from "react";
import MainMenu from "./MainMenu"; 
import { useNavigate } from "react-router-dom";

export default function JoinQueue() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Slide the panel into view shortly after mount
    setTimeout(() => setPanelOpen(true), 50);
  }, []);

  const handleJoin = () => {
    console.log("Joining queue with code:", inviteCode);
    // TODO: call your API or navigate to the chat room
    // e.g. navigate(`/chat/${inviteCode}`)
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 1) MainMenu blurred in background */}
      <div className="absolute inset-0 filter blur-sm">
        <MainMenu />
      </div>

      {/* 2) Sliding panel */}
      <div
        className={`
          fixed left-0 w-full bg-white shadow-2xl z-50
          transform transition-transform duration-500
          ${panelOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Enter an Invite Code</h2>

          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="mx-auto mb-6 block w-1/2 rounded border-2 p-2 text-center font-mono text-xl outline-none focus:border-blue-400"
          />

          <button
            onClick={handleJoin}
            className="px-8 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Join Queue
          </button>

          <p className="mt-4 text-gray-600 animate-pulse">
            Waiting for host to accept…
          </p>
          <div className="flex flex-col pt-4">
          <a href="/">❮❮ Back to Main Menu</a>
          </div>
        </div>
      </div>
    </div>
  );
}
