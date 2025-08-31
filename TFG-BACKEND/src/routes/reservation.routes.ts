import { Router } from 'express'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'
import {
  getReservations,
  getWeeklySummary
} from '../controllers/reservation.ctrl'

const router = Router()

// Get All Reservations
router.get('/', [checkSession, validateFields], getReservations)

// Get Weekly Summary
router.get('/weekly-summary', [checkSession, validateFields], getWeeklySummary)
export default router
