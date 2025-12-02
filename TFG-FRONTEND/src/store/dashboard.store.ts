import { dashboardService } from "@/services/dashboard.service";
import { GrahpsData, Metrics } from "@/types/dashboard.type";
import { create } from "zustand";
import socket from "@/services/socket.client";

type AlertState = {
  metrics: Metrics;
  hourlyStats: GrahpsData;
  weeklyAverages: GrahpsData;
  loading: boolean;
  loadingHourly: boolean;
  loadingWeekly: boolean;
  error: string | null;
  websocketEvent: number;
  clearWebsocketEvent: () => void;
  fetchMetrics: () => Promise<void>;
  fetchHourlyStats: () => Promise<void>;
  fetchWeeklyAverages: () => Promise<void>;
  initializeWebsocket: () => void;
};

const initialMetrics: Metrics = {
  noise: { value: 0, change: 0 },
  labsMonitored: { value: 0, change: 0 },
  maxDbs: { value: 0, change: 0 },
  sensorActivity: { value: 0, change: 0 },
};

const initialHourlyStats: GrahpsData = {
  values: Array(8).fill(0),
  labels: [
    "00:00",
    "03:00",
    "06:00",
    "09:00",
    "12:00",
    "15:00",
    "18:00",
    "21:00",
  ],
};

const initialWeeklyAverages: GrahpsData = {
  labels: [],
  values: [],
};

const useDashboardStore = create<AlertState>()((set) => ({
  metrics: initialMetrics,
  hourlyStats: initialHourlyStats,
  weeklyAverages: initialWeeklyAverages,
  loading: true,
  loadingHourly: true,
  loadingWeekly: true,
  error: null,
  websocketEvent: 0,
  clearWebsocketEvent: () => set({ websocketEvent: 0 }),

  fetchMetrics: async () => {
    try {
      const data = await dashboardService.fetchMetrics();

      set({
        metrics: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching metrics: ", error);
      set({ error: "Failed to fetch metrics...", loading: false });
    }
  },

  fetchHourlyStats: async () => {
    try {
      const data = await dashboardService.fetchHourlyStats();

      set({
        hourlyStats: data,
        loadingHourly: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      set({ error: "Failed to fetch data...", loadingHourly: false });
    }
  },

  fetchWeeklyAverages: async () => {
    try {
      const data = await dashboardService.fetchWeeklyAverages();

      set({
        weeklyAverages: data,
        loadingWeekly: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      set({ error: "Failed to fetch data...", loadingWeekly: false });
    }
  },

  initializeWebsocket: () => {
    socket.off("dashboardMetrics");
    socket.off("hourlyAverages");
    socket.off("weeklyAverages");

    socket.on("dashboard metrics", (data: Metrics) => {
      console.log("Received dashboard metrics via websocket:");
      set({ metrics: data });
    });

    socket.on("hourly averages", (data: GrahpsData) => {
      console.log("Received hourly averages via websocket:");
      set({ hourlyStats: data });
    });

    socket.on("weekly location averages", (data: GrahpsData) => {
      console.log("Received weekly location averages via websocket:");
      set({ weeklyAverages: data });
    });

    /* socket.on("dashboardMetricsError", (err: any) => {
      set({ error: "Error in dashboard metrics Websocket" });
      console.error(err);
    }); */
  },
}));

export default useDashboardStore;
