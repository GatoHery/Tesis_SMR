// src/api/axios.ts
import axios from 'axios';

const createEspInstance = (sensorIp: string) => {
  const baseURL = `http://${sensorIp}`;
  
  const instance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return instance;
};

export default createEspInstance;
