import { Server as SocketIOServer } from "socket.io";
import { fetchResources } from "../services/resources.services";
import { broadcastData } from "../utils/websocketConnection";

export function resourcesEmitter(io: SocketIOServer, intervalMs = 60000) {
  setInterval(async () => {
    try {
      const resources = await fetchResources();
      broadcastData(io, "simplifiedResources", resources);
    } catch (error) {
      console.error("Error broadcasting resources data: ", error);
    }
  }, intervalMs);
}
