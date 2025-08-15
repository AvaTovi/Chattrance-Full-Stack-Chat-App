import http from "node:http";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { sessionStore } from "./db";
import authRouter from "./routes/auth";
import { setupSocket } from "./socket.js";

dotenv.config();

const app = express();

const APP_PORT = process.env.APP_PORT || 3000;

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

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/{*any}", (_req, res) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const server = http.createServer(app);
const io = setupSocket(server);

app.listen(APP_PORT, () =>
	console.log(`Server running on http://localhost:${APP_PORT}`),
);
