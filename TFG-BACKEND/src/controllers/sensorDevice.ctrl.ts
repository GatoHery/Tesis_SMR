import { Request, Response } from "express";
import {
  fetchAllSensorDevices,
  upsertSensorDeviceService,
} from "../services/sensorDevice.services";
import { WebSocket, Server as WebSocketServer } from "ws";

/* Función para emitir datos por WebSocket */
const broadcastData = (ws: WebSocketServer, eventType: string, data: any) => {
  ws.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          type: eventType,
          data,
        })
      );
    }
  });
};

export const getAllSensorDevices = async (req: Request, res: Response) => {
  try {
    const ws = req.app.get("ws") as WebSocketServer;
    const sensorDevices = await fetchAllSensorDevices();
    res.status(200).json(sensorDevices);
    broadcastData(ws, "fetchedSensorDevices", sensorDevices);
  } catch (error) {
    console.error("Error fetching sensor devices:", error);
    res.status(500).json({ message: "Error fetching sensor devices" });
  }
};

export const upsertSensorDevice = async (req: Request, res: Response) => {
  const ws = req.app.get("ws") as WebSocketServer;

  try {
    const {
      ip,
      name,
      location,
      currentReading,
      notifications = false,
      alarm = false,
      threshold = 0,
    } = req.body;

    if (!ip) {
      res.status(400).json({ message: "IP is required as uid" });
      broadcastData(ws, "UpsertSensorDeviceError", {
        message: "IP is required as uid",
      });
      return;
    }

    const updated = await upsertSensorDeviceService({
      ip,
      name,
      location,
      currentReading,
      notifications,
      alarm,
      threshold,
    });

    res.status(200).json(updated);
    broadcastData(ws, "upsertedSensorDevice", updated);
  } catch (error) {
    console.error("Error upserting sensor device:", error);
    res.status(500).json({ message: "Error upserting sensor device" });
  }
};
