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
  lastAlert?: string;
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
      item.device = {
        ip: "192.168.137.201",
        name: "Sensor 1",
        threshold: item.device?.threshold || 85,
        isReal: true,
      };

      console.log(
        `📋 Sensor final threshold: ${item.device.threshold}`
      );
    });

    return filteredResources;
  },

  /* fetchResources: async (): Promise<ResourceItem[]> => {
  const res = await api.get(`${RESOURCE_PATH}`, { withCredentials: true });
  return res.data;
  }, */

  fetchSensors: async (): Promise<SensorData[]> => {
    console.log(`🔥 fetchSensors CALLED!`);
    const res = await api.get(`${SENSOR_PATH}`, { withCredentials: true });
    console.log(`📊 fetchSensors response:`, res.data);

    // FILTRAR: Solo tomar el primer sensor (tu ESP real)
    const filteredSensors = res.data.slice(0, 1) as SensorData[];

    // 🔥 Traer la última alerta para cada sensor
    for (const sensor of filteredSensors) {
      try {
        const alertRes = await api.get(`/api/sound-detection`, { withCredentials: true });
        const alerts = alertRes.data;
        
        // Obtener la última alerta (la más reciente)
        if (alerts && alerts.length > 0) {
          // Invertir para que la más reciente esté primero
          const reversedAlerts = alerts.reverse();
          const lastAlert = reversedAlerts[0];
          sensor.lastAlert = lastAlert.timestamp || lastAlert.createdAt;
          console.log(`📢 Última alerta para ${sensor.ip}: ${sensor.lastAlert}`);
        }
      } catch (error) {
        console.error(`⚠️ Error fetching last alert for ${sensor.ip}:`, error);
      }

      // El threshold viene del backend, ya que se actualiza en setThreshold
      sensor.ip = "192.168.137.201";
      sensor.name = sensor.name || "Sensor 1";
      sensor.isReal = true;

      console.log(
        `📋 Sensor final threshold: ${sensor.threshold}, IP: ${sensor.ip}`
      );
    }

    return filteredSensors;
  },

  setThreshold: async (sensorIp: string, value: number) => {
    console.log(`🔧 Setting threshold for ${sensorIp} to ${value}`);

    try {
      console.log(
        `📡 Intentando conectar a ESP en http://${sensorIp}:80/set-threshold?value=${value}`
      );

      // Cambiar en el ESP
      const espInstance = createEspInstance(sensorIp);
      const res = await espInstance.get("/set-threshold", {
        params: { value: value },
        timeout: 5000,
        validateStatus: () => true,
      });

      console.log(`✅ ESP respondió:`, res.status, res.data);

      if (res.status === 200) {
        // 🔥 Actualizar el BACKEND con el nuevo threshold
        try {
          await api.patch(`${SENSOR_PATH}`, {
            ip: sensorIp,
            threshold: value,
          });
          console.log(`💾 Backend actualizado: threshold = ${value} dB`);
        } catch (error) {
          console.error(`⚠️ Error actualizando backend:`, error);
        }

        return {
          success: true,
          data: res.data,
          message: "Threshold actualizado en ESP y backend",
        };
      } else {
        return {
          success: false,
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
        message: `No se pudo conectar al ESP en ${sensorIp}`,
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
