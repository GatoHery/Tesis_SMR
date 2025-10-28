import { SensorDevice } from "../models/sensorDevice";

export const fetchAllSensorDevices = async () => {
  try {
    return await SensorDevice.find().sort({ lastUpdated: -1 }); // Get Recent Sensor Devices
  } catch (error) {
    console.error('Error fetching sensor devices:', error);
    throw new Error('Error fetching sensor devices');
  }
}

export const upsertSensorDeviceService = async (data: {
  ip: string;
  name: string;
  location: string;
  currentReading: number;
  notifications: boolean;
  alarm: boolean;
  threshold: number;
}) => {
  try {
    // Usamos data.ip como _id
    const sensorDevice = await SensorDevice.findOneAndUpdate(
      { _id: data.ip },
      {
        _id: data.ip,              // fija el ID
        name: data.name,
        location: data.location,
        ip: data.ip,
        currentReading: data.currentReading,
        notifications: data.notifications,
        alarm: data.alarm,
        threshold: data.threshold,
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );

    return sensorDevice.toJSON();
  } catch (error) {
    console.error('Error upserting sensor device:', error);
    throw new Error('Error upserting sensor device');
  }
};