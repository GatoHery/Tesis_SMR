import { Schema, model, Types } from 'mongoose'

const SoundDetectionSchema = new Schema({
  decibels: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  sensorLocation: { type: String, required: true }
})

SoundDetectionSchema.methods.toJSON = function () {
  const { __v, _id, ...soundDetection } = this.toObject()
  soundDetection.uid = _id
  return soundDetection
}

export const SoundDetection = model('SoundDetection', SoundDetectionSchema)
