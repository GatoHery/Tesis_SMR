import { Server as SocketIOServer } from "socket.io";
import { fetchAllSensorDevices } from "../services/sensorDevice.services";

export const sensorEmitter = {
  emitAllSensors: (io: SocketIOServer, intervalMs = 60000) => {
    setInterval(async () => {
      try {
        const sensorDevices = await fetchAllSensorDevices();
        console.log("Emitting all sensors");
        io.emit("all sensors", sensorDevices);
      } catch (error) {
        console.error("Error broadcasting sensor data: ", error);
      }
    }, intervalMs);
  },
};
