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

    


    const updateFields: Record<string, any> = {
        lastUpdated: new Date()
    };

    if (typeof data.name !== "undefined") updateFields.name = data.name;
    if (typeof data.location !== "undefined") updateFields.location = data.location;
    if (typeof data.ip !== "undefined") updateFields._ip = data.ip;
    if (typeof data.currentReading !== "undefined")
      updateFields.currentReading = data.currentReading;
    if (typeof data.notifications !== "undefined")
      updateFields.notifications = Boolean(data.notifications);
    if (typeof data.alarm !== "undefined") updateFields.alarm = data.alarm;
    if (typeof data.threshold !== "undefined")
      updateFields.threshold = data.threshold;

    const sensorDevice = await SensorDevice.findOneAndUpdate(
      { _id: data.ip },
      { $set: updateFields},
      { new: true, upsert: true }
    );

    return sensorDevice.toJSON();
  } catch (error) {
    console.error('Error upserting sensor device:', error);
    throw new Error('Error upserting sensor device');
  }
};