import { Server as SocketIOServer } from "socket.io";
import {
  get3hAverages,
  getDashboardMetrics,
  getWeeklyLocationAverages,
} from "../services/dashboard.services";
import { broadcastData } from "../utils/websocketConnection";

export function dashbordEmitter(io: SocketIOServer, intervalMs = 10000) {
  setInterval(async () => {
    try {
      const metrics = await getDashboardMetrics();
      broadcastData(io, "dashboardMetrics", metrics);

      const hourly = await get3hAverages();
      broadcastData(io, "hourlyAverages", hourly);

      const weekly = await getWeeklyLocationAverages();
      broadcastData(io, "weeklyLocationAverages", weekly);  
    } catch (error) {
      console.error("Error emitting dashboard data: ", error);
      io.emit("dashboardMetricsError", error);
    }
  }, intervalMs);
}
