import { Router } from 'express'
import {
  getDashboard,
  getHourlyAverages,
  getWeeklyLocationAveragesCtrl
} from '../controllers/dashboard.ctrl'
import { validateFields } from '../middlewares/validator'
import { checkSession } from '../middlewares/session'

const router = Router()

// Object Metrics
router.get('/metrics', [checkSession, validateFields], getDashboard)

// 3h Averages
router.get('/hourly', getHourlyAverages)

// Weekly Location Averages
router.get('/weekly-location-averages', getWeeklyLocationAveragesCtrl)

export default router
