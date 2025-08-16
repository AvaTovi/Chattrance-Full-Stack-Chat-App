import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FRONTEND_ROUTES } from "../shared/endpoints";
import { useAuth } from "./AuthProvider";

function ResetPass() {
	const [form, setForm] = useState({
		password: "",
		passwordCheck: ""
	});

	const { authUser, logout, resetPassword } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const passwordsMatch = form.password === form.passwordCheck;

	const checkPassword = () => {
		if (!passwordsMatch) {
			setMessage("Passwords do not match");
		} else {
			setMessage("");
		}
	};

	const handleLogout = async () => {
		await logout();
		useNavigate(FRONTEND_ROUTES.LOGIN, { replace: true });
	};

	return (
		<div className="h-screen bg-black">
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
							{authUser ? (
								<>
									<li className="block px-4 py-2 hover:bg-gray-200">
										<Link to="/account">Account Info</Link>
									</li>
									<li className="block px-4 py-2 hover:bg-gray-200">
										<Link to="/settings">Settings</Link>
									</li>
									<li className="block px-4 py-2 hover:bg-gray-200 text-red-600">
										<button
											type="button"
											onClick={handleLogout}
											className="w-full text-left"
										>
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
			</header>
			<section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-red-500 from -10% via-indigo-400 via-50% to-orange-400 to-100%">

			</section>
		</div>
	);
}

export default ResetPass;
