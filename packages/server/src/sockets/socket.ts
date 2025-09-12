import { Server } from 'socket.io';
import http from 'http';

export function setupSocket(server: http.Server) {

  const io = new Server(server);

  io.use((socket, next) => {
    const req = socket.request;
    const res = {};
  });



  io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {

      socket.broadcast.emit('receive_message', data);

      console.log(data);

    });

  });

}