import { Server as SocketIOServer } from "socket.io";

/* Función para emitir datos por WebSocket */
export const broadcastData = (
  io: SocketIOServer,
  eventType: string,
  data: any
) => {
  io.emit(eventType, data);
};
