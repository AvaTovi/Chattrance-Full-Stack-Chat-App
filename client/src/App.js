import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./components/AuthProvider";
import Chat from "./components/Chat";
import ForgotPass from "./components/ForgotPass";
import JoinQueue from "./components/JoinQueue";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ResetPass from "./components/ResetPass";
import Signup from "./components/Signup";
import StartQueue from "./components/StartQueue";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<MainMenu />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/forgotpass" element={<ForgotPass />} />
					<Route path="/resetpass" element={<ResetPass />} />

					{/* Protected routes */}
					<Route element={<ProtectedRoutes />}>
						<Route path="/chat" element={<Chat />} />
						<Route path="/joinQueue" element={<JoinQueue />} />
						<Route path="/startQueue" element={<StartQueue />} />
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
