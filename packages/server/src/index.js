import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import session from "express-session";

import { sessionStore } from "./config/db.js";
import { setupSocket } from "./sockets/socket.js";

import authRouter from "./auth/auth-route.js";
import userRouter from "./user/user-route.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

app.use(authRouter);
app.use(userRouter);

const server = http.createServer(app);

setupSocket(server);

server.listen(process.env.PORT, () =>
	console.log(`Server running on ${process.env.BACKEND_URL}:${process.env.PORT}`),
);
