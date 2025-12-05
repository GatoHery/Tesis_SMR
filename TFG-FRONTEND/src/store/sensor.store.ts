import { monitorService } from "@/services/monitor.service";
import { Sensor } from "@/types/monitor.type";
import { create } from "zustand";
import socket from "@/services/socket.client";

type SensorState = {
  sensors: Sensor[];
  loading: boolean;
  isAlarmSetting: boolean;
  isNotificationSetting: boolean;
  isThresholdSetting: boolean;
  error: string | null;
  websocketEvent: number;
  clearWebsocketEvent: () => void;
  fetchSensors: () => Promise<void>;
  setAlarm: (sensorIp: string, value: boolean) => Promise<void>;
  setNotifications: (sensorIp: string, value: boolean) => Promise<void>;
  setThreshold: (sensorIp: string, value: number) => Promise<void>;
  initializeWebsocket: () => void;
};

const useSensorStore = create<SensorState>()((set) => ({
  sensors: [],
  loading: true,
  isAlarmSetting: false,
  isNotificationSetting: false,
  isThresholdSetting: false,
  error: null,
  websocketEvent: 0,
  clearWebsocketEvent: () => set({ websocketEvent: 0 }),

  fetchSensors: async () => {
    try {
      const data = await monitorService.fetchSensors();
      const transformed: Sensor[] = (data as any[]).map((item: any) => ({
        id: item.id,
        name: item.name,
        location: item.location,
        maxParticipants: item.maxParticipants,
        alarm: item.alarm,
        createdAt: item.createdAt,
        currentReading: item.currentReading,
        ip: item.ip,
        notifications: item.notifications,
        threshold: item.threshold,
        updatedAt: item.updatedAt,
        uid: item.uid, // Add the required uid property
        // Add any other required properties from Sensor type here
      }));
      set({
        sensors: transformed,
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

  initializeWebsocket: () => {
    socket.off("all sensors");
    socket.on("all sensors", (data: Sensor[]) => {
      console.log("Received all sensors via websocket: ");
      set({ sensors: data });
    });
  },
}));

export default useSensorStore;
