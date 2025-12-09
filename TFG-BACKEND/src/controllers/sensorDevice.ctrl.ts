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
      notifications = false,
      alarm = false,
      threshold = 0,
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

    // Se sincroniza con el ESP, si falla no debería romper el backend
    try {
      // 🔔 Alarma
      await fetch(`http://${updated.ip}/set-alarm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          value: (updated.alarm ?? false).toString(),
        }),
        signal: AbortSignal.timeout(3000),
      });

      // se actualiza el treshold buscando la ruta del ESP con el sensor especificado
      await fetch(
        `http://${updated.ip}/set-threshold?value=${updated.threshold}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        }
      );
    } catch (err) {
      console.warn(
        `ESP ${updated.ip} no respondió`,
        err
      ); /* se lanza una warning en caso de que el sensor no se encuentre o no responda */
    }

    // 3 Responder al frontend con estado REAL
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error upserting sensor device:", error);
    res.status(500).json({ message: "Error upserting sensor device" });
  }
};
