import express, { type Router } from 'express';

import { API_ROUTES } from 'chattrance-shared';

import { requireJSON } from '../utils/common.js';

import * as userController from './user-controller.js';

const router: Router = express.Router();

// No query parameters only body
router.post(API_ROUTES.AUTH.SIGNUP, requireJSON, userController.signup);

// No query parameters only body
router.post(API_ROUTES.AUTH.LOGIN, requireJSON, userController.login);

// No query parameters nor body
router.post(API_ROUTES.AUTH.LOGOUT, userController.logout);

// No query parameters nor body
router.get(API_ROUTES.USER.GET_USER, userController.getUser);

// No query parameters only body
router.post(API_ROUTES.AUTH.REQUEST_RESET_PASSWORD, requireJSON, userController.requestPasswordReset);

// Both query parameters and body
router.put(API_ROUTES.AUTH.RESET_PASSWORD, requireJSON, userController.passwordReset);

export default router;