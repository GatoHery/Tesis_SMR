import { SoundDetection } from '../models/soundDetection'
import { SensorDevice } from '../models/sensorDevice'

export const getDashboardMetrics = async () => {
  const now = new Date()

  // — Rolling 7-day window for "this week"
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - 7)
  thisWeekStart.setHours(0, 0, 0, 0)

  const thisWeekEnd = new Date(now)

  // — Previous 7-day window ("last week": 14 to 7 days ago)
  const lastWeekStart = new Date(now)
  lastWeekStart.setDate(now.getDate() - 14)
  lastWeekStart.setHours(0, 0, 0, 0)

  const lastWeekEnd = new Date(now)
  lastWeekEnd.setDate(now.getDate() - 7)
  lastWeekEnd.setHours(0, 0, 0, 0)

  // 1) Promedios de ruido
  const [thisAvgRes] = await SoundDetection.aggregate([
    { $match: { timestamp: { $gte: thisWeekStart, $lte: thisWeekEnd } } },
    { $group: { _id: null, avgNoise: { $avg: '$decibels' } } }
  ])
  const [lastAvgRes] = await SoundDetection.aggregate([
    { $match: { timestamp: { $gte: lastWeekStart, $lte: lastWeekEnd } } },
    { $group: { _id: null, avgNoise: { $avg: '$decibels' } } }
  ])
  const thisAvg = thisAvgRes?.avgNoise || 0
  const lastAvg = lastAvgRes?.avgNoise || 0
  const noiseChange = lastAvg
    ? Math.round(((thisAvg - lastAvg) / lastAvg) * 100)
    : 0

  // 2) Sensores monitoreados
  const totalSensors = await SensorDevice.countDocuments()
  const thisWeekNew = await SensorDevice.countDocuments({
    createdAt: { $gte: thisWeekStart, $lte: thisWeekEnd }
  })
  const lastWeekNew = await SensorDevice.countDocuments({
    createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd }
  })
  const labsChange = thisWeekNew - lastWeekNew

  // 3) Máximos dB
  const [thisMaxRes] = await SoundDetection.aggregate([
    { $match: { timestamp: { $gte: thisWeekStart, $lte: thisWeekEnd } } },
    { $group: { _id: null, maxNoise: { $max: '$decibels' } } }
  ])
  const [lastMaxRes] = await SoundDetection.aggregate([
    { $match: { timestamp: { $gte: lastWeekStart, $lte: lastWeekEnd } } },
    { $group: { _id: null, maxNoise: { $max: '$decibels' } } }
  ])
  const thisMax = thisMaxRes?.maxNoise || 0
  const lastMax = lastMaxRes?.maxNoise || 0
  const maxChange = parseFloat((thisMax - lastMax).toFixed(2))

  // 4) Eventos de ruido (cantidad)
  const thisCount = await SoundDetection.countDocuments({
    timestamp: { $gte: thisWeekStart, $lte: thisWeekEnd }
  })
  const lastCount = await SoundDetection.countDocuments({
    timestamp: { $gte: lastWeekStart, $lte: lastWeekEnd }
  })
  const activityChange = thisCount - lastCount

  return {
    noise: { value: Math.round(thisAvg), change: noiseChange },
    labsMonitored: { value: totalSensors, change: labsChange },
    maxDbs: { value: thisMax, change: maxChange },
    sensorActivity: { value: thisCount, change: activityChange }
  }
}

export const get3hAverages = async () => {
  // Set the timezone offset for GMT-6
  const GMT_OFFSET = -6 * 60

  // Get current UTC time and shift to GMT-6
  const now = new Date()
  const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  const nowCST = new Date(nowUtc.getTime() + GMT_OFFSET * 60000)

  // Start of today in GMT-6
  const startOfDayCST = new Date(
    nowCST.getFullYear(),
    nowCST.getMonth(),
    nowCST.getDate(),
    0,
    0,
    0,
    0
  )

  // Define your custom blocks (in hours)
  const blockHours = [
    [0, 3],
    [3, 6],
    [6, 9],
    [9, 12],
    [12, 15],
    [15, 18],
    [18, 21],
    [21, 24]
  ]

  const values: number[] = []
  const labels: string[] = []

  for (const [startHour, endHour] of blockHours) {
    // Block start/end in GMT-6
    const blockStartCST = new Date(startOfDayCST)
    blockStartCST.setHours(startHour)

    const blockEndCST = new Date(startOfDayCST)
    blockEndCST.setHours(endHour)

    console.log(
      `Querying block from ${blockStartCST.toISOString()} to ${blockEndCST.toISOString()}`
    )

    // Query MongoDB using UTC times
    const [agg] = await SoundDetection.aggregate([
      { $match: { timestamp: { $gte: blockStartCST, $lt: blockEndCST } } },
      { $group: { _id: null, avgNoise: { $avg: '$decibels' } } }
    ])

    const avg = agg?.avgNoise || 0
    values.push(Math.round(avg))

    // Label is the initial hour in GMT-6
    labels.push(startHour.toString().padStart(2, '0') + ':00')
  }

  return { values, labels }
}

export const getWeeklyLocationAverages = async () => {
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 7)

  // Aggregate average noise levels by sensor location for the past week
  const agg = await SoundDetection.aggregate([
    {
      $match: {
        timestamp: {
          $gte: weekAgo,
          $lte: now
        }
      }
    },
    {
      $group: {
        _id: '$sensorLocation',
        avgNoise: { $avg: '$decibels' }
      }
    },
    {
      $sort: { _id: 1 } // Sort by sensor location
    }
  ])

  const labels = agg.map(item => item._id as string)
  const values = agg.map(item => Math.round(item.avgNoise))

  return { labels, values }
}
