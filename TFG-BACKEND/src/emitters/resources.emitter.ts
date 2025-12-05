import { Server as SocketIOServer } from "socket.io";
import { fetchResources } from "../services/resources.services";

export const resourcesEmitter = {
  emitSimplifiedResources: (io: SocketIOServer, intervalMs = 60000) => {
    setInterval(async () => {
      try {
        let simplifiedResources: any[] = [];
        const resources = await fetchResources();
        if (Array.isArray(resources)) {
          const resourcesInDEI =
            resources?.filter((resource: any) => resource.location === "DEI") ??
            [];

          simplifiedResources = resourcesInDEI.map((resource: any) => ({
            name: resource.name,
            location: resource.location,
            maxParticipants: resource.maxParticipants,
          }));
        } else {
          simplifiedResources = [];
        }

        console.log("Emitting simplified resources");
        io.emit("simplified resources", simplifiedResources);

        /* broadcastData(io, "simplifiedResources", resources); */
      } catch (error) {
        console.error("Error broadcasting resources data: ", error);
      }
    }, intervalMs);
  },
};
