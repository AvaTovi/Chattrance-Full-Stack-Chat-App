import express from "express";

const router = express.Router();

import { API_ROUTES } from "chattrance-shared";
import { getUser } from "../controllers/user.js";

console.log(API_ROUTES.USER.GET_USER)
router.get(API_ROUTES.USER.GET_USER, getUser);

export default router;