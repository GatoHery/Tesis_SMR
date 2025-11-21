import { Router } from 'express'
import {
  googleLogin,
  login,
  microsoftCallback,
  whoAmI
} from '../controllers/auth.ctrl'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validator'
import passport from 'passport'
import { checkSession } from '../middlewares/session'

const router = Router()

// login
router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required').notEmpty(),
    validateFields
  ],
  login
)

// Login con Google
router.post('/google', googleLogin)

router.get('/microsoft', passport.authenticate('auth-microsoft'))

router.get(
  '/microsoft/callback',
  passport.authenticate('auth-microsoft', { session: false }),
  microsoftCallback
)

// Who am I
router.get('/whoami', [checkSession, validateFields], whoAmI)

export default router
