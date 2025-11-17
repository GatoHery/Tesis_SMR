import { Request, Response } from "express";

import { fetchResources } from "../services/resources.services";
import { Server as SocketIOServer } from "socket.io";
import { broadcastData } from "../utils/websocketConnection";

export const getAllResources = async (req: Request, res: Response) => {
  const io = req.app.get("io") as SocketIOServer;

  try {
    const { resources } = await fetchResources();

    // Filter resources where location is "DEI"
    const resourcesInDEI = resources.filter(
      (resource: any) => resource.location === "DEI"
    );

    const simplifiedResources = resourcesInDEI.map((resource: any) => ({
      name: resource.name,
      location: resource.location,
      maxParticipants: resource.maxParticipants,
    }));

    res.status(200).json(simplifiedResources);
    broadcastData(io, "simplifiedResources", simplifiedResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Error fetching resources" });
  }
};
