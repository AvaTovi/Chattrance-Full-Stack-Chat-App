import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function MainMenu() {
	const { authUser, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async (e) => {
		e.preventDefault();
		await logout();
	};

	const handleChatClick = () => {
		// Temporary routing logic: just go to login page for now
		navigate("/login");
	};
	// Just for testing
	const handleStartQueueClick = () => {
		navigate("/startQueue");
	};
	// Just for testing
	const handleJoinQueueClick = () => {
		navigate("/joinQueue");
	};

	return (
		<div className="h-screen flex flex-col bg-black text-white">
			{/* Header */}
			<div className="w-full px-6 py-4 flex items-center justify-between">
				{/* Logo & Title */}
				<div className="flex items-center">
					<img src="/CTlogo.jpg" alt="Logo" className="h-10 w-10 mr-3" />
					<h1
						className="text-2xl font-extrabold"
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
											className="w-full text-left">
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
										<Link to="/login">Log In</Link>
									</li>
								</>
							)}
						</ul>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-grow flex items-center justify-center">
				<div className="flex flex-col items-center gap-4 text-center px-4">
					<h2 className="text-3xl font-medium" style={{ fontFamily: "Outfit" }}>
						Welcome to Chattrance
					</h2>
					<h3
						className="text-xl font-extralight mb-2"
						style={{ fontFamily: "Outfit" }}
					>
						Chat smarter, faster, and cooler with Chattrance — your go-to place{" "}
						<br />
						for real-time conversations that just flow. Ready to dive in?
					</h3>
					<button
						type="button"
						onClick={handleChatClick}
						className="px-6 py-2 mt-4 bg-blue-600 text-white rounded"
						style={{ fontFamily: "Outfit" }}
					>
						Start Chat
					</button>
					<button
						type="button"
						onClick={handleChatClick}
						className="px-6 py-2 bg-gray-300 text-black rounded"
						style={{ fontFamily: "Outfit" }}
					>
						Join Chat
					</button>
					<button
						type="button"
						onClick={handleStartQueueClick}
						className="px-6 py-2 bg-gray-300 text-black rounded"
						style={{ fontFamily: "Outfit" }}
					>
						Testing: Start chat queue
					</button>
					<button
						type="button"
						onClick={handleJoinQueueClick}
						className="px-6 py-2 bg-gray-300 text-black rounded"
						style={{ fontFamily: "Outfit" }}
					>
						Testing: join chat queue
					</button>

					<Link to="/signup" className="mt-4 text-blue-400 underline">
						Sign up if you haven’t already
					</Link>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
