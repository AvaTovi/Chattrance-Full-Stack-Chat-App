import express from "express";

const router = express.Router();

import { SIGNUP, LOGIN, LOGOUT, GET_USER, REQUEST_RESET, RESET_PASSWORD } from "../shared/api-routes";

import { signup, login, logout, getUser, requestPasswordReset, resetPassword } from "../controllers/auth";

router.post(SIGNUP, signup);

router.post(LOGIN, login);

router.post(LOGOUT, logout);

router.get(GET_USER, getUser);

router.post(REQUEST_RESET, requestPasswordReset);

router.put(RESET_PASSWORD, resetPassword);

export default router;
