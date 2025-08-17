import validator from "validator";
import {
	ALLOWED_EMAIL_DOMAINS,
	MAX_PASSWORD_LENGTH,
	MAX_USERNAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	VALID_CHARACTERS,
} from "./constants.js";

export function validateSignup(username, password, email) {
	if (!username || !password || !email) return "Please fill all fields";
	if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password))
		return "Username and password must be alphanumeric and may include !, @, $, _, and - characters";
	if (!validator.isEmail(email, { host_whitelist: ALLOWED_EMAIL_DOMAINS }))
		return "Invalid email format";
	if (username.length > MAX_USERNAME_LENGTH)
		return `Username must be <= ${MAX_USERNAME_LENGTH} characters`;
	if (password.length > MAX_PASSWORD_LENGTH)
		return `Password must be <= ${MAX_PASSWORD_LENGTH} characters`;
	if (password.length < MIN_PASSWORD_LENGTH)
		return `Password must be >= ${MIN_PASSWORD_LENGTH} characters`;
	return null;
}

export function validateLogin(username, password) {
	if (!username || !password) return "Please fill all fields";
	if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password))
		return "Username and password must be alphanumeric and may include !, @, $, _, and - characters";
	if (username.length > MAX_USERNAME_LENGTH)
		return `Username must be <= ${MAX_USERNAME_LENGTH} characters`;
	if (password.length > MAX_PASSWORD_LENGTH)
		return `Password must be <= ${MAX_PASSWORD_LENGTH} characters`;
	if (password.length < MIN_PASSWORD_LENGTH)
		return `Password must be >= ${MIN_PASSWORD_LENGTH} characters`;
	return null;
}

export function isValidEmail(email) {
	return validator.isEmail(email, { host_whitelist: ALLOWED_EMAIL_DOMAINS })
		? null
		: "Invalid email format";
}

export function isValidPassword(password) {
	if (password.length < MIN_PASSWORD_LENGTH)
		return `Password must be >= ${MIN_PASSWORD_LENGTH} characters`;
	if (password.length > MAX_PASSWORD_LENGTH)
		return `Password must be <= ${MAX_PASSWORD_LENGTH} characters`;
	if (!VALID_CHARACTERS.test(password))
		return "Password must be alphanumeric and may include !, @, $, _, and - characters";
	return null;
}

/**
 * 
 * @param {string} message 
 * @returns {string}
 */
export function sanitizeMessage(message) {
	const regex = /[&<>"']/g;
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&apos;"
	};
	return message.replace(regex, match => map[match]);
}
