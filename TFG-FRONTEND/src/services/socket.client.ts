// src/socket.ts
import { io } from "socket.io-client";

/* const socket = io(
  process.env.VITE_BASE_URL || "https://dei.uca.edu.sv",
  {
    path: "/alarma/api/socket.io",
    transports: ["websocket"],
    withCredentials: true,
  }
); */
const socket = io("ws://localhost:3000");

export default socket;
