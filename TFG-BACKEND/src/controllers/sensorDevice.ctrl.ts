import { Request, Response } from 'express';
import { fetchAllSensorDevices, updateSensorThresholdService, upsertSensorDeviceService } from '../services/sensorDevice.services';

export const getAllSensorDevices = async (req: Request, res: Response) => {
  try {
    const sensorDevices = await fetchAllSensorDevices();
    res.status(200).json(sensorDevices);
  } catch (error) {
    console.error('Error fetching sensor devices:', error);
    res.status(500).json({ message: 'Error fetching sensor devices' });
  }
}

export const upsertSensorDevice = async (req: Request, res: Response) => {
  try {
    const {
      ip,
      name,
      location,
      currentReading,
      notifications = false,
      alarm = false,
      threshold = 0
    } = req.body;

    if (!ip) {
      res.status(400).json({ message: 'IP is required as uid' });
      return;
    }

    const updated = await upsertSensorDeviceService({
      ip,
      name,
      location,
      currentReading,
      notifications,
      alarm,
      threshold
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error upserting sensor device:', error);
    res.status(500).json({ message: 'Error upserting sensor device' });
  }
};

export const updateSensorThreshold = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ip, threshold } = req.body;

    if (!ip || threshold === undefined) {
      res.status(400).json({
        status: 'error',
        message: 'IP and threshold are required'
      });
      return;
    }

    const updatedSensor = await SensorDevice.findOneAndUpdate(
      { ip: ip },
      { 
        threshold: threshold,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!updatedSensor) {
      res.status(404).json({
        status: 'error',
        message: 'Sensor not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Threshold updated successfully',
      data: updatedSensor
    });

  } catch (error) {
    console.error('Error updating threshold:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};