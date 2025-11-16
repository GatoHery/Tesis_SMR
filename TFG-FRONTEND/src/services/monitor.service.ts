import api from "@/api/axiosInstance";
import createEspInstance from "@/api/espInstance";

const RESOURCE_PATH = '/api/resources';
const SENSOR_PATH = '/api/sensor-devices';

export const monitorService = {
  fetchResources: async () => {
    console.log(`🔥 fetchResources CALLED!`);
    const res = await api.get(`${RESOURCE_PATH}`, { withCredentials: true });

    console.log(`📋 fetchResources called, processing ${res.data.length} items`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.data.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        const sensorNumber = Math.floor(index / 2) + 1;
        const isRealESP = sensorNumber === 1;
        const sensorId = `sensor_${sensorNumber}`;
        
        const savedThreshold = localStorage.getItem(`threshold_${sensorId}`);
        console.log(`🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}, isRealESP = ${isRealESP}`);
        
        const finalThreshold = savedThreshold 
          ? parseInt(savedThreshold) 
          : (isRealESP ? 50 : Math.floor(Math.random() * 61) + 20);
        
        console.log(`📋 Sensor ${sensorNumber} final threshold: ${finalThreshold}`);
        
        item.device = {
          ip: isRealESP ? `192.168.137.1` : `192.168.137.${37 + index}`,
          name: `Sensor ${sensorNumber}${isRealESP ? ' (ESP Real)' : ' (Simulado)'}`,
          threshold: finalThreshold,
          isReal: isRealESP
        }
      } else {
        item.device = null;
      }
    });

    return res.data;
  },

  fetchSensors: async () => {
    console.log(`🔥 fetchSensors CALLED!`);
    const res = await api.get(`${SENSOR_PATH}`, { withCredentials: true });
    console.log(`📊 fetchSensors response:`, res.data);
    
    // Aplicar la misma lógica que fetchResources
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.data.forEach((sensor: any, index: number) => {
      const sensorNumber = index + 1;
      const isRealESP = sensorNumber === 1;
      const sensorId = `sensor_${sensorNumber}`;
      
      const savedThreshold = localStorage.getItem(`threshold_${sensorId}`);
      console.log(`🔍 Sensor ${sensorNumber}: savedThreshold = ${savedThreshold}, isRealESP = ${isRealESP}`);
      
      // Sobrescribir threshold con valor guardado o por defecto
      sensor.threshold = savedThreshold 
        ? parseInt(savedThreshold) 
        : (isRealESP ? 50 : sensor.threshold || Math.floor(Math.random() * 61) + 20);
      
      // Actualizar IP del primer sensor para que sea el ESP real
      if (isRealESP) {
        sensor.ip = '192.168.137.1';
        sensor.name = sensor.name ? `${sensor.name} (ESP Real)` : 'Sensor 1 (ESP Real)';
      }
      
      console.log(`📋 Sensor ${sensorNumber} final threshold: ${sensor.threshold}`);
    });
    
    return res.data;
  },

  setThreshold: async (sensorIp: string, value: number) => {
    console.log(`🔧 Setting threshold for ${sensorIp} to ${value}`);
    
    // Identificar si es el ESP real
    const isRealESP = sensorIp === '192.168.137.1';
    const sensorId = isRealESP ? 'sensor_1' : `sensor_${sensorIp.split('.').pop()}`;
    
    // Siempre guardar en localStorage para persistencia
    localStorage.setItem(`threshold_${sensorId}`, value.toString());
    console.log(`💾 Threshold saved in localStorage for ${sensorId}`);
    
    if (isRealESP) {
      try {
        console.log(`📡 Sending to real ESP at ${sensorIp} (puerto 80)`);
        
        // Usar exactamente el endpoint y parámetro que espera tu ESP
        const res = await createEspInstance(sensorIp).post('/set-threshold',
          new URLSearchParams({ value: value.toString() }), // Tu ESP espera "value"
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        console.log(`✅ ESP responded successfully:`, res.data);
        return res.data;
      } catch (error) {
        console.error(`❌ ESP error, but threshold saved locally:`, error);
        return { success: true, savedLocally: true };
      }
    } else {
      console.log(`🔧 Simulated sensor, only localStorage`);
      return { success: true, savedLocally: true };
    }
  },

  setAlarm: async (sensorIp: string, value: boolean) => {
    if (sensorIp === '192.168.137.1') {
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
    }
    return { success: true, savedLocally: true };
  },

  setNotifications: async (sensorIp: string, value: boolean) => {
    if (sensorIp === '192.168.137.1') {
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
    }
    return { success: true, savedLocally: true };
  },

};