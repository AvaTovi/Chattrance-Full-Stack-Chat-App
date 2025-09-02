import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import session from "express-session";
import { Server } from "socket.io";

import { sessionStore } from "./db.js";
import authRouter from "./routes/auth.js";
import { insertMessage, getConversation, getAllConversations, createConversation } from "./models/message.js"

dotenv.config();

const app = express();

const __dirname = import.meta.dirname;
const __clientdir = path.join(__dirname, "../../client/build");

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

app.use("/api", authRouter);

app.use(express.static(__clientdir));
app.get("/{*any}", (_req, res) => {
	res.sendFile(path.join(__clientdir, "index.html"));
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on("send_message", (data) => {
		socket.broadcast.emit("receive_message", data)
		console.log(data);
	});
});

server.listen(process.env.APP_PORT, () =>
	console.log(`Server running on ${process.env.BACKEND_URL}:${APP_PORT}`),
);
