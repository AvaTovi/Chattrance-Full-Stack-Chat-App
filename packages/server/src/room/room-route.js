import express from "express";

import { API_ROUTES } from "chattrance-shared";

import { requireJSON } from "../utils/common.js";

import * as roomController from "./room-controller";

const router = express.Router();

router.get(API_ROUTES.CHAT.GET_ROOMS, roomController.getRooms);

router.delete(API_ROUTES.CHAT.DELETE_ROOMS, requireJSON, roomController.deleteRoom)

export default router;