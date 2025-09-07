import express from "express";

import { API_ROUTES } from "chattrance-shared";

import { requireJSON } from "../utils/common.js";

import * as userController from "./user-controller.js";

const router = express.Router();

router.post(API_ROUTES.AUTH.SIGNUP, requireJSON, userController.signup);

router.post(API_ROUTES.AUTH.LOGIN, requireJSON, userController.login);

router.post(API_ROUTES.AUTH.LOGOUT, userController.logout);

router.post(API_ROUTES.AUTH.REQUEST_RESET_PASSWORD, requireJSON, userController.requestPasswordReset);

router.put(API_ROUTES.AUTH.RESET_PASSWORD, requireJSON, userController.passwordReset);

router.get(API_ROUTES.USER.GET_USER, userController.getUser);

export default router;