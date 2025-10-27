import { Router } from 'express'
import { getAllSensorDevices, updateSensorThreshold, upsertSensorDevice } from '../controllers/sensorDevice.ctrl'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'

const router = Router()

// Get All Sensor Devices
router.get("/", [checkSession, validateFields], getAllSensorDevices)

// Upsert Sensor Device
router.patch("/", [validateFields], upsertSensorDevice)

router.patch('/threshold', [validateFields], updateSensorThreshold);

export default router