import { Router } from 'express'
import { deleteRoleCtrl, getAllRoles, getRoleById, postRole } from '../controllers/role.ctrl'
import { checkSession } from '../middlewares/session'
import { validateFields } from '../middlewares/validator'
import { checkAdmin } from '../middlewares/checkAdmin'

const router = Router()

// Get All Roles
router.get('/',[checkAdmin,checkSession, validateFields], getAllRoles)

// Get Role by ID
router.get('/:id',[checkAdmin,checkSession, validateFields], getRoleById)

// Create Role
router.post('/', [checkAdmin,checkSession, validateFields],postRole)

// Delete Role
router.delete('/:id', [checkAdmin,checkSession, validateFields], deleteRoleCtrl)

export default router
