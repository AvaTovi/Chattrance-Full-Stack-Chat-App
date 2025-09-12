import { useEffect, useState } from "react";
import MainMenu from "../Home/MainMenu";

export default function StartQueue() {
	const [panelOpen, setPanelOpen] = useState(false);
	const [inviteCode, setInviteCode] = useState("");

	useEffect(() => {
		// generate a random 6‑char code
		const code = Math.random().toString(36).substr(2, 6).toUpperCase();
		setInviteCode(code);

		// wait a tick, then slide panel down
		setTimeout(() => setPanelOpen(true), 50);
	}, []);

	return (
		<div className="relative h-screen w-screen overflow-hidden">
			{/* Render MainMenu in the background, slightly blurred */}
			<div className="absolute inset-0 filter blur-sm">
				<MainMenu />
			</div>

			{/* Sliding panel */}
			<div
				className={`fixed left-0 w-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ${panelOpen ? "translate-y-0" : "-translate-y-full"}`}
			>
				<div className="p-8 text-center">
					<h2 className="text-3xl font-bold mb-4">Your Invite Code</h2>
					<p className="text-5xl font-mono mb-6">{inviteCode}</p>
					<div className="text-lg text-gray-700 animate-pulse">
						Waiting for your friend to join…
					</div>
					<div className="flex flex-col pt-4">
						<a href="/">❮❮ Back to Main Menu</a>
					</div>
				</div>
			</div>
		</div>
	);
}
