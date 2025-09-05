import express from "express";

import { API_ROUTES } from "chattrance-shared";

const router = express.Router();

router.get(API_ROUTES.CHAT.GET_ROOMS, getRooms);

export default router;