import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import session from "express-session";
import { Server } from "socket.io";

import { sessionStore } from "./config/db.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js"
import { BASE } from "./shared/api-routes.js";

import { insertMessage, getConversation, getAllConversations, createConversation } from "./models/message.js"

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

app.use(BASE, authRouter);
app.use(BASE, userRouter);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("send_message", (data) => {
		socket.broadcast.emit("receive_message", data)
		console.log(data);
	});
});

server.listen(process.env.PORT, () =>
	console.log(`Server running on ${process.env.BACKEND_URL}:${process.env.PORT}`),
);
