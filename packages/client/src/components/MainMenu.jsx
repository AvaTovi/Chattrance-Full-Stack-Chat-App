import { Link, useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

function MainMenu() {
  const navigate = useNavigate();

  const handleChatClick = () => {
    // keep your current behavior for Start/Join
    navigate("/login");
  };

  const handleStartQueueClick = () => {
    navigate("/startQueue");
  };

  const handleJoinQueueClick = () => {
    navigate("/joinQueue");
  };

  // NEW: dev-only shortcut straight to Chat (the lobby)
  const handleOpenChatDev = () => {
    navigate("/chat"); // <-- bypass auth via query
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Header and Navigation Bar */}
      <NavBar />

      {/* Main */}
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h2 className="text-3xl font-medium" style={{ fontFamily: "Outfit" }}>
            Welcome to Chattrance
          </h2>
          <h3 className="text-xl font-extralight mb-2" style={{ fontFamily: "Outfit" }}>
            Chat smarter, faster, and cooler with Chattrance — your go-to place
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

          {/* NEW testing button */}
          <button
            type="button"
            onClick={handleOpenChatDev}
            className="px-6 py-2 bg-gray-300 text-black rounded"
            style={{ fontFamily: "Outfit" }}
          >
            Testing: open chat lobby (dev)
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
