import { Server } from "socket.io";
import { sessionStore } from "../config/db";

export function setupSocket(server) {

  const io = new Server(server);

  io.use((socket, next) => {
    const req = socket.request;
    const res = {};


  })



  io.on("connection", (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {

      socket.broadcast.emit("receive_message", data);

      console.log(data);

    });

  });

}