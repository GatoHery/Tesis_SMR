import { Server as SocketIOServer } from "socket.io";
import { fetchAllSounds } from "../services/soundDetection.services";

export const soundEmitter = {
  emitAllSounds: (io: SocketIOServer, intervalMs = 60000) => {
    setInterval(async () => {
      try {
        const sounds = await fetchAllSounds();
        io.emit("all sounds", sounds);
      } catch (error) {
        console.error("Error broadcasting sensor data: ", error);
      }
    }, intervalMs);
  },
};
