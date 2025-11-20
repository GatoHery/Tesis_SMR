// src/socket.ts
import { io } from "socket.io-client";

const socket = io(
  process.env.VITE_BASE_URL || "https://dei.uca.edu.sv",
  {
    path: "/alarma/socket.io",
    transports: ["websocket"],
    withCredentials: true,
  }
);

export default socket;
