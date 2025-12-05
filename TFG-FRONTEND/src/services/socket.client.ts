// src/socket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL || "https://dei.uca.edu.sv", {
  path: "/alarma/api/socket.io",
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
