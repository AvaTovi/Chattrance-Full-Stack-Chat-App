import MongoStore from "connect-mongo";
import cors from "cors";
import { cleanEnv, str, email, num, url } from "envalid";
import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import http from "http";
import { StatusCodes } from "http-status-codes";

import { createApiResponse } from './utils/common.js';
import { startDB } from "./config/mongoose.js";
import { setupSocket } from "./sockets/socket.js";

import roomRouter from "./room/room-route.js";
import userRouter from "./user/user-route.js";

export const env = cleanEnv(process.env, {
	DB_HOST: str(),
	DB_USER: str(),
	DB_PASSWORD: str(),
	DB_PORT: num({ default: 3306 }),
	DB_NAME: str(),
	DB_CONNECTION_LIMIT: num({ default: 20 }),
	SESSION_SECRET: str(),
	EMAIL_ID: email(),
	EMAIL_PASSWORD: str(),
	FRONTEND_URL: url(),
	BACKEND_URL: url(),
	PORT: num({ default: 5000 }),
	NODE_ENV: str({ choices: ["development", "production"] })
});

await startDB();

const app = express();
app.use(cors());
app.use(express.json());

interface Error {
	status?: number
}

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
	if (err instanceof SyntaxError && err.status === StatusCodes.BAD_REQUEST && "body" in err) {
		console.error(err);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json(createApiResponse(false, err.message));
		return;
	}
	next();
});

const options = {};

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create(options),
		cookie: {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		},
	}),
);

app.use(userRouter);
app.use(roomRouter);

const server = http.createServer(app);

setupSocket(server);

server.listen(process.env.PORT, () =>
	console.log(`Server running on ${env.BACKEND_URL}:${env.PORT}`),
);
