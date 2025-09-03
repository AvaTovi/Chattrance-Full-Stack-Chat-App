import express from "express";

const router = express.Router();

import { GET_USER } from "../shared/api-routes.js";
import { getUser } from "../controllers/user.js";

router.get(GET_USER, getUser);

export default router;