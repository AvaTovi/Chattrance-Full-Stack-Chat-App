import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import session from "express-session";

import { sessionStore } from "./config/db.js";
import { setupSocket } from "./sockets/socket.js";

import userRouter from "./user/user-route.js"
import { StatusCodes } from "http-status-codes";

/**
 * Creates API response object.
 *
 * @param {boolean} ok - Indicates success or failure
 * @param {string?} error - Optional error message
 * @param {*} data - Optional data payload
 * @returns { { ok: boolean, error: string?, data: * } } API response object
 */
function apiResponse(ok = true, error = null, data = {}) {
	return {
		ok,
		error,
		data
	};
}

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === StatusCodes.BAD_REQUEST && "body" in err) {
		console.error(err);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json(apiResponse(false, err.message));
	}
	next();
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		},
	}),
);

app.use(userRouter);

const server = http.createServer(app);

setupSocket(server);

server.listen(process.env.PORT, () =>
	console.log(`Server running on ${process.env.BACKEND_URL}:${process.env.PORT}`),
);
