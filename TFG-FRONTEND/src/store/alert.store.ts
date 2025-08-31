import { alertService } from "@/services/alert.service";
import { Alert } from "@/types/alert.type";
import { create } from "zustand";

type AlertState = {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchAlerts: () => Promise<void>;
}

const useAlertStore = create<AlertState>()(
  (set) => ({
    alerts: [],
    loading: true,
    error: null,

    fetchAlerts: async () => {
      try {
        const data = await alertService.fetchAlerts();

        set({
          alerts: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching alerts: ", error);
        set({ error: "Failed to fetch alerts..." });
      }
    },
  })
);

export default useAlertStore;