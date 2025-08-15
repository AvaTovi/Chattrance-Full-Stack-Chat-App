import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";

import {
	authenticateUser,
	createUser,
	deleteResetToken,
	findByEmail,
	insertResetToken,
	isUserTaken,
	updatePassword,
} from "../models/user.js";
import { API_ROUTES } from "../shared/endpoints.js";
import { LOGIN_DURATION } from "../utils/constants.js";
import { mailTemplate, sendEmail } from "../utils/email.js";

import {
	isValidEmail,
	isValidPassword,
	validateLogin,
	validateSignup,
} from "../utils/validator.js";

dotenv.config();
const router = express.Router();
const { SIGNUP, LOGIN, LOGOUT, USER, REQUEST_RESET, RESET_PASSWORD } =
	API_ROUTES;

router.post(SIGNUP, async (req, res) => {
	const { username, password, email } = req.body;

	const error = validateSignup(username, password, email);
	if (error !== null) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
	}

	try {
		if (await isUserTaken(username, email)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Username or email already exists" });
		}
		const userId = await createUser(username, password, email);
		res.status(StatusCodes.OK).json({ userId, message: "Signup successful" });
	} catch (err) {
		console.error(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Signup failed" });
	}
});

router.post(LOGIN, async (req, res) => {
	const { username, password, rememberPassword } = req.body;

	const error = validateLogin(username, password);
	if (error !== null) {
		return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
	}

	try {
		const user = await authenticateUser(username, password);
		if (!user) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Invalid login" });
		}

		req.session.regenerate((err) => {
			if (err) {
				console.error("Session regeneration error:", err);
				return res
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.json({ message: "Server error" });
			}
			req.session.user = {
				id: user.id,
				username: user.username,
				email: user.email,
			};
			if (rememberPassword) {
				req.session.cookie.maxAge = LOGIN_DURATION;
			}
			return res
				.status(StatusCodes.OK)
				.json({ user: req.session.user, message: "Login successful" });
		});
	} catch (err) {
		console.error(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Login failed" });
	}
});

router.post(LOGOUT, (req, res) => {
	req.session.destroy((err) => {
		if (err)
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Logout failed" });
		res.clearCookie("connect.sid");
		res.status(StatusCodes.OK).json({ message: "Logout successful" });
	});
});

router.get(USER, (req, res) => {
	if (req.session.user) {
		return res.status(StatusCodes.OK).json({ user: req.session.user });
	} else {
		return res.status(StatusCodes.OK).json({ message: "Not logged in" });
	}
});

router.post(REQUEST_RESET, async (req, res) => {
	try {
		const { email } = req.body;
		const error = isValidEmail(email);
		if (error) {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
		}
		const user = await findByEmail(email);
		if (user) {
			const resp = await insertResetToken(user.id);
			if (resp.status === "ok") {
				const mailOptions = {
					email: email,
					subject: "Chattrance -- Password Reset Link",
					message: mailTemplate(
						"We have received a request to reset your password. Please reset your password using the link below.",
						`${process.env.FRONTEND_URL}/api${REQUEST_RESET}?id=${user.id}&token=${resp.token}`,
						"Reset Password",
					),
				};
				await sendEmail(mailOptions);
			}
		}
		return res.status(StatusCodes.OK).json({
			message: "Email has been sent if account is associated with email",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Server error" });
	}
});

router.post(RESET_PASSWORD, async (req, res) => {
	try {
		const { id, token } = req.params;
		if (!id || !token) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Invalid link" });
		}
		const { password } = req.body;
		const error = isValidPassword(password);
		if (error) {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
		}
		if (await updatePassword(id, password)) {
			await deleteResetToken(id);
			return res.status(StatusCodes.OK).json({ message: "Password updated" });
		}
	} catch (err) {
		console.error(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ message: "Server error" });
	}
});

export default router;
