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

import { FRONTEND_ROUTES } from "chattrance-shared";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<MainMenu />} />
					<Route path={FRONTEND_ROUTES.AUTH.LOGIN} element={<Login />} />
					<Route path={FRONTEND_ROUTES.AUTH.SIGNUP} element={<Signup />} />
					<Route path={FRONTEND_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPass />} />
					<Route path={FRONTEND_ROUTES.AUTH.RESET_PASSWORD} element={<ResetPass />} />

					{/* Protected routes */}
					<Route element={<ProtectedRoutes />}>
						<Route path={FRONTEND_ROUTES.CHAT} element={<Chat />} />
						<Route path={FRONTEND_ROUTES.QUEUE.JOIN} element={<JoinQueue />} />
						<Route path={FRONTEND_ROUTES.QUEUE.START} element={<StartQueue />} />
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
