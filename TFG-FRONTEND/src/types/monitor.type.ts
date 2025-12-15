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
  lastAlert?: string
}