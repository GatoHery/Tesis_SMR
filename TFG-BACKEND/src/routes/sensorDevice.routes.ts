import { Router } from 'express'
import { getAllSensorDevices, upsertSensorDevice } from '../controllers/sensorDevice.ctrl'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'

const router = Router()

// Get All Sensor Devices
router.get("/", [checkSession, validateFields], getAllSensorDevices)

// Upsert Sensor Device
router.patch("/", [validateFields], upsertSensorDevice)

export default router