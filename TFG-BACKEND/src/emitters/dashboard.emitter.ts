import { Server as SocketIOServer } from "socket.io";
import {
  get3hAverages,
  getDashboardMetrics,
  getWeeklyLocationAverages,
} from "../services/dashboard.services";

export const dashboardEmitter = {
  emitDashboardData: async (io: SocketIOServer, intervalMs = 10000) => {
    const metrics = await getDashboardMetrics();
    setInterval(() => {
      try {
        io.emit("dashboard metrics", metrics);
      } catch (error) {
        console.error("Error emitting dashboard data: ", error);
        io.emit("dashboardMetricsError", error);
      }
    }, intervalMs);
  },
  emitHourlyAverages: async (io: SocketIOServer, intervalMs = 10000) => {
    const hourly = await get3hAverages();
    setInterval(() => {
      try {
        io.emit("hourly averages", hourly);
      } catch (error) {
        console.error("Error emitting hourly averages: ", error);
        io.emit("hourlyAveragesError", error);
      }
    }, intervalMs);
  },
  emitWeeklyLocationAverages: (io: SocketIOServer, intervalMs = 10000) => {
    setInterval(async () => {
      try {
        const weekly = await getWeeklyLocationAverages();
        io.emit("weekly location averages", weekly);
      } catch (error) {
        console.error("Error emitting hourly averages: ", error);
        io.emit("hourlyAveragesError", error);
      }
    }, intervalMs);
  },
};
