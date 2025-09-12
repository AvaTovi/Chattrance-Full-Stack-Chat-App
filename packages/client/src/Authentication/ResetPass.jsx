import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavBar from "../Components/NavBar";
import { useAuth } from "./AuthProvider";

import { FRONTEND_ROUTES } from "chattrance-shared";

function ResetPass() {
	const [form, setForm] = useState({
		password: "",
		passwordCheck: ""
	});

	const [searchParams] = useSearchParams();
	const { resetPassword } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const passwordsMatch = form.password === form.passwordCheck;
	const id = searchParams.get("id");
	const token = searchParams.get("token");

	const handleChange = (e) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		const res = await resetPassword(id, token, form.password);
		setMessage(res.message);
		if (res.success) {
			setTimeout(() => {
				navigate(FRONTEND_ROUTES.LOGIN, { replace: true });
			}, 1000);
		}
	};

	useEffect(() => {
		if (!id || !token) {
			navigate(FRONTEND_ROUTES.AUTH.LOGIN, { replace: true });
		}
	}, [id, token]);


	return (
		<div className="h-screen bg-black">

			{/* Header */}
			<NavBar />

			<section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-400 via-50% to-orange-400 to-100%">
				<div className="flex shadow-2xl">
					<div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl">
						<h1 className="text-5xl font-bold">
							Reset Password
						</h1>
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

						{/* Message */}
						<p className="text-red-600 font-semibold">
							{!passwordsMatch ? "Passwords do not match" : message}
						</p>

						<div>
							<button
								type="button"
								onClick={handleResetPassword}
								disabled={!passwordsMatch}
								className="px-10 py-2 text-2xm rounded-md bg-gradient-to-r from-green-500 to-green-400 to-100% hover:from-purple-500 hover:to-yellow-500 text-white"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ResetPass;
