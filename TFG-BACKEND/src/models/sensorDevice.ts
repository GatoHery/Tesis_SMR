// src/models/sensorDevice.ts
import { Schema, model } from 'mongoose';

const SensorDeviceSchema = new Schema({
  _id: String,          
  name: String,
  location: String,
  ip: String,           
  currentReading: Number,
  notifications: Boolean,
  alarm: Boolean,
  threshold: Number
}, {
  timestamps: true,
  _id: false            // desactiva la generación automática de ObjectId
});

SensorDeviceSchema.methods.toJSON = function () {
  const { __v, _id, ...sensorDevice } = this.toObject();
  sensorDevice.uid = _id; // Renombrar _id a uid
  return sensorDevice;
};

export const SensorDevice = model('SensorDevice', SensorDeviceSchema);
