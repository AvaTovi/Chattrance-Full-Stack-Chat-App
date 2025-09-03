import express from "express";

const router = express.Router();

import { SIGNUP, LOGIN, LOGOUT, REQUEST_RESET, RESET_PASSWORD } from "../shared/api-routes.js";

import { signup, login, logout, requestPasswordReset, resetPassword } from "../controllers/auth.js";

router.post(SIGNUP, signup);

router.post(LOGIN, login);

router.post(LOGOUT, logout);

router.post(REQUEST_RESET, requestPasswordReset);

router.put(RESET_PASSWORD, resetPassword);

export default router;
