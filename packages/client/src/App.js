import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./Authentication/AuthProvider";
import ForgotPass from "./Authentication/ForgotPass";
import Login from "./Authentication/Login";
import ResetPass from "./Authentication/ResetPass";
import Signup from "./Authentication/Signup";

import Chat from "./Chat/Chat";
import JoinQueue from "./Chat/JoinQueue";
import StartQueue from "./Chat/StartQueue";

import MainMenu from "./Home/MainMenu";

import ProtectedRoutes from "./Routes/ProtectedRoutes";

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
