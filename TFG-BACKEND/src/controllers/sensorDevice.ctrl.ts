import { Request, Response } from "express";
import {
  fetchAllSensorDevices,
  upsertSensorDeviceService,
} from "../services/sensorDevice.services";

export const getAllSensorDevices = async (req: Request, res: Response) => {
  try {
    const sensorDevices = await fetchAllSensorDevices();
    res.status(200).json(sensorDevices);
  } catch (error) {
    console.error("Error fetching sensor devices:", error);
    res.status(500).json({ message: "Error fetching sensor devices" });
  }
};

export const upsertSensorDevice = async (req: Request, res: Response) => {
  try {
    const {
      ip,
      name,
      location,
      currentReading,
      notifications,
      alarm,
      threshold,
    } = req.body;

    if (!ip) {
      res.status(400).json({ message: "IP is required as uid" });
      return;
    }

    /* se almacena y se recupera de DB el sensor modificado */
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
  } catch (error) {
    console.error("Error upserting sensor device:", error);
    res.status(500).json({ message: "Error upserting sensor device" });
  }
};
