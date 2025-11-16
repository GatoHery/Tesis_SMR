// src/api/axios.ts
import axios from 'axios';

const createEspInstance = (sensorIp: string) => {
  // Tu ESP está en puerto 80
  const baseURL = `http://${sensorIp}`;
  
  console.log(`🔗 Creating ESP instance for: ${baseURL}`);
  
  const instance = axios.create({
    baseURL,
    timeout: 5000, // 5 segundos timeout
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Interceptors para debugging
  instance.interceptors.request.use(
    (config) => {
      console.log(`📡 ESP Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log(`📤 Data:`, config.data);
      return config;
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ ESP Response: ${response.status}`, response.data);
      return response;
    },
    (error) => {
      console.error(`❌ ESP Error:`, error.response?.status, error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createEspInstance;
