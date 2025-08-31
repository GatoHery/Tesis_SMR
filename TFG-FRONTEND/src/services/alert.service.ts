import api from "@/api/axiosInstance";

const ALERT_PATH = '/sound-detection';

export const alertService = {
  fetchAlerts: async () => {
    const res = await api.get(`${ALERT_PATH}`, { withCredentials: true });

    return res.data;
  },
};