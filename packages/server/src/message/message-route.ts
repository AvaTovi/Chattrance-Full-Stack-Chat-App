import express, { Router } from 'express';

import { API_ROUTES } from 'chattrance-shared';

import { requireJSON } from '../utils/common.js';

import * as messageController from './message-controller.js';

const router = express.Router();

router.get(API_ROUTES.MESSAGES.GET_MESSAGES, messageController.getMessages);

router.post(API_ROUTES.MESSAGES.CREATE_MESSAGE, requireJSON, messageController.createMessage, messageController.createMessage);

router.delete(API_ROUTES.MESSAGES.DELETE_MESSAGE, messageController.deleteMessage);

export default router;