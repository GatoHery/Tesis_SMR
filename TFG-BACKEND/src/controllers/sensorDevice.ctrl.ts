import { Request, Response } from "express";
import {
  fetchAllSensorDevices,
  upsertSensorDeviceService,
} from "../services/sensorDevice.services";
import { Server as SocketIOServer } from "socket.io";
import { broadcastData } from "../utils/websocketConnection";

export const getAllSensorDevices = async (req: Request, res: Response) => {
  try {
    const io = req.app.get("io") as SocketIOServer;
    const sensorDevices = await fetchAllSensorDevices();
    res.status(200).json(sensorDevices);
    broadcastData(io, "fetchedSensorDevices", sensorDevices);
  } catch (error) {
    console.error("Error fetching sensor devices:", error);
    res.status(500).json({ message: "Error fetching sensor devices" });
  }
};

export const upsertSensorDevice = async (req: Request, res: Response) => {
  const io = req.app.get("io") as SocketIOServer;

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
      broadcastData(io, "UpsertSensorDeviceError", {
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
    broadcastData(io, "upsertedSensorDevice", updated);
  } catch (error) {
    console.error("Error upserting sensor device:", error);
    res.status(500).json({ message: "Error upserting sensor device" });
  }
};
