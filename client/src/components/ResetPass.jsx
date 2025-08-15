import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../shared/endpoints";
import { useAuth } from "./AuthProvider";

function ResetPass() {
	const [form, setForm] = useState({
		password: "",
		passwordCheck: "",
	});

	const [isOpen, setIsOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { authUser, logout, resetPassword } = useAuth();
	const isLoggedIn = Boolean(authUser);
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const navigate = useNavigate();
	const [message, setMessage] = useState("");

	const handleLogout = async () => {
		await logout();
		navigate(FRONTEND_ROUTES.LOGIN);
	};

	useEffect(() => {
		setPasswordsMatch(form.password === form.passwordCheck);
		if (!passwordsMatch) {
			setMessage("Passwords do not match");
		} else {
			setMessage("");
		}
	}, [form.password, form.passwordCheck, passwordsMatch]);
}

export default ResetPass;
