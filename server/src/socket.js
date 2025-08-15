import { Server } from "socket.io";
export function setupSocket(server) {
	const io = new Server(server, {
		cors: { origin: "*" },
	});
	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.id}`);
		socket.on("sendMessage", (msg) => {
			console.log("Message received:", msg);
			io.emit("receiveMessage", msg);
		});
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`);
		});
		return io;
	});
}
