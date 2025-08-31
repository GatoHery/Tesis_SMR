import { dashboardService } from '@/services/dashboard.service';
import { GrahpsData, Metrics } from '@/types/dashboard.type';
import { create } from "zustand";

type AlertState = {
  metrics: Metrics;
  hourlyStats: GrahpsData;
  weeklyAverages: GrahpsData;
  loading: boolean;
  loadingHourly: boolean;
  loadingWeekly: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchHourlyStats: () => Promise<void>;
  fetchWeeklyAverages: () => Promise<void>;
}

const initialMetrics: Metrics = {
  noise: { value: 0, change: 0 },
  labsMonitored: { value: 0, change: 0 },
  maxDbs: { value: 0, change: 0 },
  sensorActivity: { value: 0, change: 0 },
};

const initialHourlyStats: GrahpsData = {
  values: Array(8).fill(0),
  labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
};

const initialWeeklyAverages: GrahpsData = {
  labels: [],
  values: [],
};

const useDashboardStore = create<AlertState>()(
  (set) => ({
    metrics: initialMetrics,
    hourlyStats: initialHourlyStats,
    weeklyAverages: initialWeeklyAverages,
    loading: true,
    loadingHourly: true,
    loadingWeekly: true,
    error: null,

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
  })
);

export default useDashboardStore;