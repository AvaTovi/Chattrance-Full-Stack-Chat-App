import { useState } from "react";

import NavBar from "./NavBar";

import { useAuth } from "./AuthProvider";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { requestReset } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    const res = await requestReset(email);
    setMessage(res.message);
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <NavBar />

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
