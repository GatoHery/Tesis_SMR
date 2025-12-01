import { Server as SocketIOServer } from "socket.io";
import { fetchResources } from "../services/resources.services";

export const resourcesEmitter = {
  emitSimplifiedResources: (io: SocketIOServer, intervalMs = 60000) => {
    setInterval(async () => {
      try {
        const resources = await fetchResources();

        const resourcesInDEI = resources.filter(
          (resource: any) => resource.location === "DEI"
        );

        const simplifiedResources = resourcesInDEI.map((resource: any) => ({
          name: resource.name,
          location: resource.location,
          maxParticipants: resource.maxParticipants,
        }));

        io.emit("simplified resources", simplifiedResources);

        /* broadcastData(io, "simplifiedResources", resources); */
      } catch (error) {
        console.error("Error broadcasting resources data: ", error);
      }
    }, intervalMs);
  },
};
