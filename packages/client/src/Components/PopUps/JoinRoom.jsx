import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

import { API_ROUTES } from "chattrance-shared";

import './JoinRoom.css';

const JoinRoomPopUp = ({ onClose }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    roomId: "",
    password: ""
  });

  const handleForm = (e) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleJoinRoom = async () => {
    const res = await fetch(`${API_ROUTES.CHAT.JOIN_ROOM}?room-id=${form.roomId.toLowerCase()}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: form.password })
    });
    if (res.ok) {
      setMessage("Joined room successfully");
    } else {
      setMessage(res.error);
    }
  }

  return (
    <div className="popup-container">
      <div className="popup">
        <div className="flex flex-col items-center gap-3">
          <span>Room ID</span>
          <input
            className="outline-none rounded-md p-1 border-2 focus:border-blue-400 focus:bg-slate-500"
            type="text"
            name="roomId"
            value={form.roomId}
            onChange={handleForm}
          />
          <span>Room Password</span>
          <input
            className="outline-none rounded-md p-1 border-2 focus:border-blue-400 focus:bg-slate-500"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleForm}
          />

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-blue-500 hover:text-blue-700"
            >
              {showPassword ? <FiEye size={24} /> : <FiEyeOff size={24} />}
            </button>
            <span className="ml-2">Show Password</span>
          </div>

          <button
            onClick={handleJoinRoom}
            className="mt-2 px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white">
            Join Room
          </button>

          <button
            className="text-blue-400 mt-2 underline hover:underline"
            onClick={onClose}>Close Button</button>

          <p className="text-red-600 font-semibold">
            {message ? message : null}
          </p>

        </div>
      </div>
    </div>
  );

}

export default JoinRoomPopUp;