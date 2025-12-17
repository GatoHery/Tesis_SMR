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

const useSensorStore = create<SensorState>()((set, get) => ({
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
        lastAlert: item.lastAlert,
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

  setAlarm: async (sensorIp: string, value: boolean) => {
    set({
      isAlarmSetting: true,
      error: null,
    }); /* actualización del estado global para limpiar errores anteriores y deshabilitar el switch mientras se guardan cambios*/

    try {
      const sensor = get().sensors.find(
        (s) => s.ip === sensorIp
      ); /* lectura del estado actual y encontrar el sensor al que se le están haciendo modificaciones */
      if (!sensor) {
        throw new Error(
          `Sensor not found: ${sensorIp}`
        ); /* si no se encuentra el sensor se lanza un error */
      }

      const updated = await monitorService.upsertSensor({
        ip: sensor.ip,
        name: sensor.name,
        location: sensor.location,
        alarm: value,
        lastAlert: sensor.lastAlert,
      }); /* se llama al servicio donde se manda un payload con los datos completos del sensor que se está modificando */

      set((state) => ({
        sensors: state.sensors.map((s) => (s.ip === sensorIp ? updated : s)),
        isAlarmSetting: false,
      })); /* se busca el sensor cuya ip coincida con la recibida y se reemplaza ese sensor con el actualizado */
    } catch (error) {
      console.error("setAlarm error:", error);
      set({
        isAlarmSetting: false,
        error: "Failed to update alarm",
      });
      throw error;
    }
  },

  setNotifications: async (sensorIp, value) => {
    set({
      isNotificationSetting: true,
      error: null,
    }); /* actualización del estado global para limpiar errores anteriores y deshabilitar el switch mientras se guardan cambios*/

    try {
      const sensor = get().sensors.find(
        (s) => s.ip === sensorIp
      ); /* lectura del estado actual y encontrar el sensor al que se le están haciendo modificaciones */
      if (!sensor) {
        throw new Error(
          `Sensor not found: ${sensorIp}`
        ); /* si no se encuentra el sensor se lanza un error */
      }

      const updated = await monitorService.upsertSensor({
        ip: sensor.ip,
        name: sensor.name,
        location: sensor.location,
        notifications: value,
        lastAlert: sensor.lastAlert,
      }); /* se llama al servicio donde se manda un payload con los datos completos del sensor que se está modificando */

      set((state) => ({
        sensors: state.sensors.map((s) => (s.ip === sensorIp ? updated : s)),
        isNotificationSetting: false,
      })); /* se busca el sensor cuya ip coincida con la recibida y se reemplaza ese sensor con el actualizado */
    } catch (error) {
      console.error("setNotifications error:", error);
      set({
        isNotificationSetting: false,
        error: "Failed to update notifications",
      });
      throw error;
    }
  },

  setThreshold: async (sensorIp: string, value: number) => {
    set({ isThresholdSetting: true, error: null });

    try {
      const sensor = get().sensors.find((s) => s.ip === sensorIp);
      if (!sensor) throw new Error("Sensor not found");

      const updated = await monitorService.upsertSensor({
        ip: sensor.ip,
        name: sensor.name,
        location: sensor.location,
        threshold: value,
        lastAlert: sensor.lastAlert,
      });

      set((state) => ({
        sensors: state.sensors.map((s) => (s.ip === sensorIp ? updated : s)),
        isThresholdSetting: false,
      }));
    } catch (error) {
      console.error("setThreshold error:", error);
      set({
        isThresholdSetting: false,
        error: "Failed to update threshold",
      });
      throw error;
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
