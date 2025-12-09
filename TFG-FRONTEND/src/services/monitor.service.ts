import api from "@/api/axiosInstance";
import createEspInstance from "@/api/espInstance";

const RESOURCE_PATH = "/api/resources";
const SENSOR_PATH = "/api/sensor-devices";

// Interfaces para tipar correctamente
interface SensorDevice {
  ip: string;
  name: string;
  threshold: number;
  isReal: boolean;
}

interface ResourceItem {
  device?: SensorDevice | null;
  [key: string]: unknown;
}

interface SensorData {
  ip?: string;
  name?: string;
  threshold?: number;
  isReal?: boolean;
  [key: string]: unknown;
}

export const monitorService = {
  fetchResources: async (): Promise<ResourceItem[]> => {
    console.log(`🔥 fetchResources CALLED!`);
    const res = await api.get(`${RESOURCE_PATH}`, { withCredentials: true });

    console.log(
      `📋 fetchResources called, processing ${res.data.length} items`
    );

    // FILTRAR: Solo tomar el primer elemento con device
    const filteredResources = res.data.slice(0, 1) as ResourceItem[];

    filteredResources.forEach((item: ResourceItem) => {
      const sensorNumber = 1;
      const sensorId = `sensor_${sensorNumber}`;

      const savedThreshold = localStorage.getItem(`threshold_${sensorId}`);
      console.log(
        `🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}`
      );

      const finalThreshold = savedThreshold ? parseInt(savedThreshold) : 85;

      console.log(
        `📋 Sensor ${sensorNumber} final threshold: ${finalThreshold}`
      );

      item.device = {
        ip: "192.168.137.201",
        name: "Sensor 1",
        threshold: finalThreshold,
        isReal: true,
      };
    });

    return filteredResources;
  },

  fetchSensors: async (): Promise<SensorData[]> => {
    console.log(`🔥 fetchSensors CALLED!`);
    const res = await api.get(`${SENSOR_PATH}`, { withCredentials: true });
    console.log(`📊 fetchSensors response:`, res.data);

    // FILTRAR: Solo tomar el primer sensor (tu ESP real)
    const filteredSensors = res.data.slice(0, 1) as SensorData[];

    filteredSensors.forEach((sensor: SensorData) => {
      const sensorNumber = 1;
      const sensorId = `sensor_${sensorNumber}`;

      const savedThreshold = localStorage.getItem(`threshold_${sensorId}`);
      console.log(
        `🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}`
      );

      // Configurar el único sensor real
      sensor.threshold = savedThreshold
        ? parseInt(savedThreshold)
        : sensor.threshold || 85;

      sensor.ip = "192.168.137.201";
      sensor.name = sensor.name || "Sensor 1";
      sensor.isReal = true;

      console.log(
        `📋 Sensor ${sensorNumber} final threshold: ${sensor.threshold}, IP: ${sensor.ip}`
      );
    });

    return filteredSensors;
  },

  setThreshold: async (sensorIp: string, value: number) => {
    console.log(`🔧 Setting threshold for ${sensorIp} to ${value}`);

    const sensorNumber = parseInt(sensorIp.split(".").pop() || "100") - 99;
    const sensorId = `sensor_${sensorNumber}`;

    localStorage.setItem(`threshold_${sensorId}`, value.toString());
    console.log(`💾 Threshold saved in localStorage for ${sensorId}`);

    try {
      console.log(
        `📡 Intentando conectar a ESP en http://${sensorIp}:80/set-threshold?value=${value}`
      );

      // Usar parámetros en la URL (query string)
      const espInstance = createEspInstance(sensorIp);

      const res = await espInstance.get("/set-threshold", {
        params: { value: value },
        timeout: 5000,
        validateStatus: () => true,
      });

      console.log(`✅ ESP respondió:`, res.status, res.data);

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
          message: "Threshold actualizado en el ESP",
        };
      } else {
        return {
          success: false,
          savedLocally: true,
          status: res.status,
          message: "ESP respondió con error",
        };
      }
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      console.error(`❌ Error conectando ESP:`, {
        message: err.message,
        code: err.code,
        ip: sensorIp,
      });

      return {
        success: false,
        savedLocally: true,
        message: `No se pudo conectar al ESP en ${sensorIp}. Threshold guardado localmente.`,
      };
    }
  },

  /* setAlarm: async (sensorIp: string, value: boolean) => {
    try {
      const res = await createEspInstance(sensorIp).patch(
        "/set-alarm",
        new URLSearchParams({ value: value.toString() }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("ESP alarm error:", error);
      throw error;
    }
  }, */

  upsertSensor: async (payload: SensorData) => {
    const res = await api.patch(
      `${SENSOR_PATH}`,
      payload
    ); /* se llama al endpoint que permite actualizar el sensor especificado */
    return res.data; /* se retorna el sensor modificado */
  },

  setNotifications: async (sensorIp: string, value: boolean) => {
    try {
      const res = await createEspInstance(sensorIp).patch(
        "/set-notification",
        new URLSearchParams({ value: value.toString() }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("ESP notifications error:", error);
      throw error;
    }
  },
};
