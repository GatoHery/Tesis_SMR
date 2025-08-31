// src/api/axios.ts
import axios from 'axios';

const createEspInstance = (ip: string) => {
  return axios.create({
    baseURL: `http://${ip}`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default createEspInstance;
