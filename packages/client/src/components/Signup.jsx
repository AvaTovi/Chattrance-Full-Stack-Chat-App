import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

import { useAuth } from "./AuthProvider";

function Signup() {
	const [form, setForm] = useState({
		username: "",
		password: "",
		passwordCheck: "",
		email: ""
	});

	const [showPassword, setShowPassword] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const passwordsMatch = form.password === form.passwordCheck;

	const handleChange = (e) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		const res = await signup(form.username, form.password, form.email);
		setMessage(res.message);
		if (res.success) {
			setTimeout(() => {
				setMessage("Redirecting...");
			}, 1000);
			setTimeout(() => {
				navigate(FRONTEND_ROUTES.LOGIN);
			}, 1000);
		}
	};

	return (
		<div className="h-screen bg-black">

			{/* Header */}
			<NavBar />

			{/* Signup screen */}
			<section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-400 via-50% to-orange-400 to-100%">
				<div className="">
					<div className="flex flex-col items-center p-20 gap-8 bg-white rounded-2xl w-full">
						<h1 className="text-5xl font-bold">Create Account</h1>
						{/* Username */}
						<div className="flex flex-col text-2xl text-left gap-1">
							<span>Username</span>
							<input
								type="text"
								name="username"
								value={form.username}
								onChange={handleChange}
								className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
							/>
						</div>
						{/* Password */}
						<div className="flex flex-col text-2xl text-left gap-1">
							<span>Password</span>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={form.password}
								onChange={handleChange}
								className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
							/>
						</div>

						{/* Show Password Button */}
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

						{/* Password Check */}
						<div className="flex flex-col text-2xl text-left gap-1">
							<span>Confirm Password</span>
							<input
								type={showPassword ? "text" : "password"}
								name="passwordCheck"
								value={form.passwordCheck}
								onChange={handleChange}
								className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
							/>
						</div>

						{/* Email */}
						<div className="flex flex-col text-2xl text-left gap-1">
							<span>Email</span>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								className="rounded-md p-1 border-2 outline-none focus:border-blue-400 focus:bg-slate-500"
							/>
						</div>

						<p className="text-red-600 font-semibold">
							{!passwordsMatch ? "Passwords do not match" : message}
						</p>

						{/* Sign Up Button */}
						<div>
							<button
								type="button"
								onClick={handleSignup}
								disabled={!passwordsMatch}
								className="px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white"
							>
								Sign Up
							</button>
						</div>
						<div className="mt-1">
							<a
								href="/"
								className="text-blue-400 mt-5 underline hover:underline"
							>
								Back to Main Menu
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Signup;
