import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

import { useAuth } from "./AuthProvider";

import { FRONTEND_ROUTES } from "chattrance-shared";

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    const res = await login(username, password, rememberMe);

    if (res.ok) {
      setMessage("Login successful");

      setTimeout(() => {

        setMessage("Redirecting…");
        navigate(FRONTEND_ROUTES.HOME);

      }, 1500);
    }

    setMessage(res.error);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <NavBar />

      {/* Login screen */}
      <section className="h-full flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-500 via-50% to-orange-400 to-100%">
        <div className="flex shadow-2xl">
          <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl">
            <h1 className="text-5xl font-bold">Welcome</h1>
            {/* Username */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
              />
            </div>
            {/* Password */}
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
              />
            </div>
            {/* Remember Me button */}
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                }}
              />
              <span className="text-base">Remember Me</span>
            </div>

            {message && <p className="text-red-600 font-semibold">{message}</p>}

            {/* Login Button */}
            <div>
              <button
                type="button"
                onClick={handleLogin}
                className="px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white"
              >
                Login
              </button>
              <p className="font-semibold pt-5">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-400 hover:underline">
                  Register
                </a>
              </p>
            </div>
            <div className="flex flex-col mt-1">
              <a
                href="/"
                className="text-blue-400 mt-5 underline hover:underline"
              >
                Back to Main Menu
              </a>
              <br />
              <a
                href="/forgotPass"
                className="text-blue-400 pb-2 underline hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
