import express, { Router } from "express";
import { API_ROUTES } from "chattrance-shared";
import { requireJSON } from "../utils/common.js";
import * as roomController from "./room-controller.js";
const router = express.Router();
// No body neccessary nor query parameters
router.get(API_ROUTES.CHAT.GET_ROOMS, roomController.getRooms);
// No query parameters only body
router.post(API_ROUTES.CHAT.CREATE_ROOMS, requireJSON, roomController.createRoom);
// Use query parameters
router.delete(API_ROUTES.CHAT.DELETE_ROOMS, roomController.deleteRoom);
// Use query parameters and body
router.patch(API_ROUTES.CHAT.JOIN_ROOM, requireJSON, roomController.joinRoom);
export default router;
//# sourceMappingURL=room-route.js.map