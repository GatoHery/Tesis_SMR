import { SoundDetection } from '../models/soundDetection'

export const fetchAllSounds = async () => {
  return await SoundDetection.find().sort({ createdAt: -1 }) // Get Recent Sounds
}

export const fetchSoundById = async (id: string) => {
  return await SoundDetection.findById(id)
}

export const createSound = async (data: {
decibels: number
  timestamp?: Date
  sensorLocation: string
}) => {
  try {
    const newSound = new SoundDetection({
      decibels: data.decibels,
      timestamp: data.timestamp || new Date(),
      sensorLocation: data.sensorLocation
    })

    return await newSound.save()
  } catch (error) {
    console.error('Error creating sound detection:', error)
    throw new Error('Error creating sound detection')
  }
}
