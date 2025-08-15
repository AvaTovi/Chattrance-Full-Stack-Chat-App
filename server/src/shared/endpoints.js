// Backend API routes
export const API_ROUTES = {
	SIGNUP: "/auth/signup",
	LOGIN: "/auth/login",
	LOGOUT: "/auth/logout",
	USER: "/auth/user",
	REQUEST_RESET: "/auth/request-reset", // send email
	RESET_PASSWORD: "/auth/password-reset", // actually reset password
};

// Frontend routes
export const FRONTEND_ROUTES = {
	SIGNUP: "/signup",
	LOGIN: "/login",
	RESET_PASSWORD_PAGE: "/auth/reset-password", // page with the form
};
