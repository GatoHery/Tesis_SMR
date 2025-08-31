import api from "@/api/axiosInstance";

const DASHBOARD_PATH = '/dashboard';

export const dashboardService = {
  fetchMetrics: async () => {
    const res = await api.get(`${DASHBOARD_PATH}/metrics`, { withCredentials: true });

    return res.data;
  },

  fetchHourlyStats: async () => {
    const res = await api.get(`${DASHBOARD_PATH}/hourly`, { withCredentials: true });

    return res.data;
  },

  fetchWeeklyAverages: async () => {
    const res = await api.get(`${DASHBOARD_PATH}/weekly-location-averages`, { withCredentials: true });

    return res.data;
  },

};