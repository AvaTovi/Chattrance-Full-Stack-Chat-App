import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    const res = await login(username, password, rememberPassword);
    setMessage(res.message);
    if (res.success) {
      setTimeout(() => {
        setMessage("Redirecting...");
      }, 1000);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
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
              <li className="block px-4 py-2 hover:bg-gray-200">
                <Link to="/signup">Sign Up</Link>
              </li>
              <li className="block px-4 py-2 hover:bg-gray-200">
                <Link to="/settings">Settings</Link>
              </li>
              <li className="block px-4 py-2 hover:bg-gray-200">
                <Link to="/">Back to Home</Link>
              </li>
            </ul>
          )}
        </div>
      </header>

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
            {/* Remember password button */}
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={(e) => {
                  setRememberPassword(e.target.checked);
                }}
              />
              <span className="text-base">Remember Password</span>
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
