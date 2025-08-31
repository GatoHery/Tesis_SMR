import { Router } from 'express'
import {
  getAllSounds,
  getSoundById,
  postSound
} from '../controllers/soundDetection.ctrl'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'

const router = Router()

// Get All Sounds
router.get('/', [checkSession, validateFields], getAllSounds)

// Get Sound by ID
router.get('/:id',[checkSession, validateFields], getSoundById)

// Post Sound
router.post('/',[validateFields], postSound)

export default router
