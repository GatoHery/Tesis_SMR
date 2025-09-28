import api from "@/api/axiosInstance";
import createEspInstance from "@/api/espInstance";

const RESOURCE_PATH = '/api/resources';
const SENSOR_PATH = '/api/sensor-devices';

export const monitorService = {
  fetchResources: async () => {
    const res = await api.get(`${RESOURCE_PATH}`, { withCredentials: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.data.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        item.device = {
          ip: `192.168.1.${37 + index}`,
          name: `Sensor ${Math.floor(index / 2) + 1}`,
          threshold: Math.floor(Math.random() * 61) + 20,
        }
      } else {
        item.device = null;
      }
    });

    return res.data;
  },

  fetchSensors: async () => {
    const res = await api.get(`${SENSOR_PATH}`, { withCredentials: true });

    return res.data;
  },

  setAlarm: async (sensorIp: string, value: boolean) => {
    const res = await createEspInstance(sensorIp).post('set-alarm',
      new URLSearchParams({ value: value.toString() }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data;
  },

  setNotifications: async (sensorIp: string, value: boolean) => {
    const res = await createEspInstance(sensorIp).post('set-notification',
      new URLSearchParams({ value: value.toString() }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data;
  },

  setThreshold: async (sensorIp: string, value: number) => {
    const res = await createEspInstance(sensorIp).post('set-threshold',
      new URLSearchParams({ value: value.toString() }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data;
  },

};