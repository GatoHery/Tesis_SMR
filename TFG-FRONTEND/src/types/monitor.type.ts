export interface SensorDevice {
  ip: string;
  name: string;
  threshold: number;
  isReal: boolean;
}

export interface ResourceItem {
  device?: SensorDevice | null;
  [key: string]: unknown;
}

export interface SensorData {
  ip?: string;
  name?: string;
  threshold?: number;
  isReal?: boolean;
  [key: string]: unknown;
}

// Interfaces antiguas (compatibilidad)
export interface Resource {
  id: number;
  name: string;
  location: string;
  maxParticipants: number;
}

export interface Sensor {
  alarm: boolean
  createdAt: string
  currentReading: number
  ip: string
  location: string
  name: string
  notifications: boolean
  threshold: number
  updatedAt: string
  uid: string
}