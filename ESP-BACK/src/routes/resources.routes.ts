import { Router } from 'express'
import { validateFields } from '../middlewares/validator'
import { getAllResources } from '../controllers/resources.ctrl'
import { checkSession } from '../middlewares/session'

const router = Router()

// Get All Resources
router.get('/', [checkSession, validateFields], getAllResources)

export default router
