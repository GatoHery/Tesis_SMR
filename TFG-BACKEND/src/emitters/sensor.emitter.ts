import { Server as SocketIOServer } from "socket.io";
import { fetchAllSensorDevices } from "../services/sensorDevice.services";
import { broadcastData } from "../utils/websocketConnection";

export function sensorEmitter(io: SocketIOServer, intervalMs = 60000) {
  setInterval(async () => {
    try {
      const sensorDevices = await fetchAllSensorDevices();
      const simplifiedSensorDevices = sensorDevices.map((device) => ({
        ip: device.ip,
        name: device.name,
        location: device.location,
        currentReading: device.currentReading,
        notifications: device.notifications,
        alarm: device.alarm,
        threshold: device.threshold,
        lastUpdated: device.updatedAt,
      }));
      broadcastData(io, "fetchedSensorDevices", simplifiedSensorDevices);
    } catch (error) {
      console.error("Error broadcasting sensor data: ", error);
    }
  }, intervalMs);
}
