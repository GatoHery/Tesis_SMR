import { monitorService } from "@/services/monitor.service";
import { Sensor } from "@/types/monitor.type";
import { create } from "zustand";

type SensorState = {
  sensors: Sensor[];
  loading: boolean;
  isAlarmSetting: boolean;
  isNotificationSetting: boolean;
  isThresholdSetting: boolean;
  error: string | null;
  fetchSensors: () => Promise<void>;
  setAlarm: (sensorIp: string, value: boolean) => Promise<void>;
  setNotifications: (sensorIp: string, value: boolean) => Promise<void>;
  setThreshold: (sensorIp: string, value: number) => Promise<void>;
}

const useSensorStore = create<SensorState>()(
  (set) => ({
    sensors: [],
    loading: true,
    isAlarmSetting: false,
    isNotificationSetting: false,
    isThresholdSetting: false,
    error: null,

    fetchSensors: async () => {
      try {
        const data = await monitorService.fetchSensors();

        set({
          sensors: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching sensors: ", error);
        set({ loading: false, error: "Failed to fetch sensors..." });
      }
    },

    setAlarm: async (sensorIp, value) => {
      set({ isAlarmSetting: true });

      try {
        await monitorService.setAlarm(sensorIp, value);
        set((state) => ({
          isAlarmSetting: false,
          sensors: state.sensors.map((sensor) =>
            sensor.ip === sensorIp ? { ...sensor, alarm: value } : sensor
          ),
        }));
      } catch (error) {
        console.error(`Error setting alarm for sensor ${sensorIp}:`, error);
        set({ error: "Failed to set alarm...", isAlarmSetting: false });
      }
    },

    setNotifications: async (sensorIp, value) => {
      set({ isNotificationSetting: true });

      try {
        await monitorService.setNotifications(sensorIp, value);
        set((state) => ({
          isNotificationSetting: false,
          sensors: state.sensors.map((sensor) =>
            sensor.ip === sensorIp ? { ...sensor, notifications: value } : sensor
          ),
        }));
      } catch (error) {
        console.error(`Error setting alarm for sensor ${sensorIp}:`, error);
        set({ error: "Failed to set alarm...", isNotificationSetting: false });
      }
    },

    setThreshold: async (sensorIp, value) => {
      set({ isThresholdSetting: true });

      try {
        await monitorService.setThreshold(sensorIp, value);
        set((state) => ({
          isThresholdSetting: false,
          sensors: state.sensors.map((sensor) =>
            sensor.ip === sensorIp ? { ...sensor, threshold: value } : sensor
          ),
        }));
      } catch (error) {
        console.error(`Error setting threshold for sensor ${sensorIp}:`, error);
        set({ error: "Failed to set threshold...", isThresholdSetting: false });
      }
    },
  })
);

export default useSensorStore;