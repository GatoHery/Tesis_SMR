import { Router } from 'express'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'
import { getReservations } from '../controllers/reservation.ctrl'

const router = Router()

// Get All Reservations
router.get('/', [checkSession, validateFields], getReservations)

export default router
