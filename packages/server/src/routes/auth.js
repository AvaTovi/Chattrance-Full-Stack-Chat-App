import express from "express";

const router = express.Router();

import { API_ROUTES } from "chattrance-shared";

import { signup, login, logout, requestPasswordReset, resetPassword } from "../controllers/auth.js";

router.post(API_ROUTES.AUTH.SIGNUP, signup);

router.post(API_ROUTES.AUTH.LOGIN, login);

router.post(API_ROUTES.AUTH.LOGOUT, logout);

router.post(API_ROUTES.AUTH.REQUEST_RESET_PASSWORD, requestPasswordReset);

router.put(API_ROUTES.AUTH.RESET_PASSWORD, resetPassword);

export default router;
