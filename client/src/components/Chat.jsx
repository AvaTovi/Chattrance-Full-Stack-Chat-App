import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { FRONTEND_ROUTES } from "../shared/endpoints";

function Chat() {

	const [isOpen, setIsOpen] = useState(false);
	const { authUser, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate(FRONTEND_ROUTES.LOGIN, { replace: true });
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
						</ul>
					)}
				</div>
			</header>
		</div>
	);
}

export default Chat;
