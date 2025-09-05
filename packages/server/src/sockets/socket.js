import { Server } from "socket.io";

/**
 * 
 * @param {http.Server<typeof IncomingMessage, typeof ServerResponse>} server
 */
export function setupSocket(server) {

  const io = new Server(server);

  io.on("connection", (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {

      socket.broadcast.emit("receive_message", data);

      console.log(data);

    });

  });

}