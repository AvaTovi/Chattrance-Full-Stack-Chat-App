import cors from 'cors';
import dotenv from 'dotenv';
import { cleanEnv, str, email, num, url } from 'envalid';
import express, { type Request, type Response, type NextFunction } from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { StatusCodes } from 'http-status-codes';

import { createApiResponse } from './utils/common.js';
import { startDB } from './config/mongoose.js';
import { setupSocket } from './sockets/socket.js';

import userRouter from './user/user-route.js';
import roomRouter from './room/room-route.js';
import messageRouter from './message/message-route.js';

dotenv.config();

export const env = cleanEnv(process.env, {
	SESSION_SECRET: str(),
	EMAIL_ID: email(),
	EMAIL_PASSWORD: str(),
	FRONTEND_URL: url(),
	BACKEND_URL: url(),
	PORT: num({ default: 5000 }),
	NODE_ENV: str({ choices: ['development', 'production'] })
});

await startDB();

const app = express();

app.use(cors());

app.use(express.json());

interface Error {
	status?: number
}

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
	if (err instanceof SyntaxError && err.status === StatusCodes.BAD_REQUEST && 'body' in err) {
		console.error(err);
		res
			.status(StatusCodes.BAD_REQUEST)
			.json(createApiResponse(false, err.message));
		return;
	}
	next();
});

const sessionMiddleware = session({
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		// @ts-expect-error
		client: mongoose.connection.getClient()
	}),
	cookie: {
		httpOnly: true,
		secure: false,
		sameSite: 'strict',
	},
});

app.use(sessionMiddleware);
app.use(userRouter);
app.use(roomRouter);
app.use(messageRouter);

const server = http.createServer(app);

setupSocket(server, sessionMiddleware);

server.listen(process.env.PORT, () =>
	console.log(`Server running on ${env.BACKEND_URL}:${env.PORT}`),
);
