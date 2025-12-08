import api from "@/api/axiosInstance";
import createEspInstance from "@/api/espInstance";

const RESOURCE_PATH = '/api/resources';
const SENSOR_PATH = '/api/sensor-devices';

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

interface ApiError {
  message: string;
  code?: string;
  response?: {
    data?: unknown;
    status?: number;
  };
}

export const monitorService = {
  fetchResources: async (): Promise<ResourceItem[]> => {
    console.log(`🔥 fetchResources CALLED!`);
    const res = await api.get(`${RESOURCE_PATH}`, { withCredentials: true });

    console.log(`📋 fetchResources called, processing ${res.data.length} items`);

    // FILTRAR: Solo tomar el primer elemento con device
    const filteredResources = res.data.slice(0, 1) as ResourceItem[];

    filteredResources.forEach((item: ResourceItem) => {
      const sensorNumber = 1;
      const sensorId = `sensor_${sensorNumber}`;
      
      const savedThreshold = localStorage.getItem(`threshold_${sensorId}`);
      console.log(`🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}`);
      
      const finalThreshold = savedThreshold 
        ? parseInt(savedThreshold) 
        : 85;
      
      console.log(`📋 Sensor ${sensorNumber} final threshold: ${finalThreshold}`);
      
      item.device = {
        ip: '192.168.137.201',
        name: 'Sensor 1',
        threshold: finalThreshold,
        isReal: true
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
      console.log(`🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}`);
      
      // Configurar el único sensor real
      sensor.threshold = savedThreshold 
        ? parseInt(savedThreshold) 
        : (sensor.threshold || 85);
      
      sensor.ip = '192.168.137.100';
      sensor.name = sensor.name || 'Sensor 1';
      sensor.isReal = true;
      
      console.log(`📋 Sensor ${sensorNumber} final threshold: ${sensor.threshold}, IP: ${sensor.ip}`);
    });
    
    return filteredSensors;
  },

  setThreshold: async (sensorIp: string, value: number) => {
    console.log(`🔧 Setting threshold for ${sensorIp} to ${value}`);
    
    const sensorNumber = parseInt(sensorIp.split('.').pop() || '100') - 99;
    const sensorId = `sensor_${sensorNumber}`;
    
    localStorage.setItem(`threshold_${sensorId}`, value.toString());
    console.log(`💾 Threshold saved in localStorage for ${sensorId}`);
    
    try {
      console.log(`📡 Attempting to connect to ESP at ${sensorIp}:80`);
      
      const res = await createEspInstance(sensorIp).get(`/set-threshold?value=${value}`, {
        timeout: 5000, // Reducir timeout a 5 segundos
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Solo considerar 2xx como éxito
        }
      });
      console.log(`✅ ESP responded successfully:`, res.data);
      return res.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      
      // Mejorar logging del error
      console.error(`❌ ESP connection failed to ${sensorIp}:`, {
        message: apiError.message,
        code: apiError.code,
        status: apiError.response?.status,
        timeout: apiError.code === 'ECONNABORTED' ? 'Request timeout' : 'Connection error'
      });
      
      // Si es timeout o error de red, pero el valor se guardó localmente, es parcialmente exitoso
      if (apiError.code === 'ECONNABORTED' || apiError.message.includes('Network Error')) {
        console.log(`⚠️ Network error but threshold saved locally`);
        return { 
          success: true, 
          savedLocally: true, 
          warning: 'ESP no responde pero threshold guardado localmente' 
        };
      }
      
      return { success: false, savedLocally: true, error: apiError.message };
    }
  },

  setAlarm: async (sensorIp: string, value: boolean) => {
    try {
      const res = await createEspInstance(sensorIp).patch('/set-alarm',
        new URLSearchParams({ value: value.toString() }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error('ESP alarm error:', error);
      throw error;
    }
  },

  setNotifications: async (sensorIp: string, value: boolean) => {
    try {
      const res = await createEspInstance(sensorIp).patch('/set-notification',
        new URLSearchParams({ value: value.toString() }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error('ESP notifications error:', error);
      throw error;
    }
  },

};