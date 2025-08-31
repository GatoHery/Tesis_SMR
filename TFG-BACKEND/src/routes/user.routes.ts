import { Router } from 'express'
import {
  getAllUsers,
  getUserStatsController,
  postUser
} from '../controllers/user.ctrl'
import { validateFields } from '../middlewares/validator'
import { checkSession } from '../middlewares/session'
import { checkAdmin } from '../middlewares/checkAdmin'

const router = Router()

// Get All Users
router.get('/', [checkSession, validateFields], getAllUsers)

router.get('/stats', [checkSession, validateFields], getUserStatsController)

// Create User
router.post('/', [checkSession, checkAdmin, validateFields], postUser)

export default router
