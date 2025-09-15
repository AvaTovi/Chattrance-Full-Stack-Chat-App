import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true
});

export default socket;