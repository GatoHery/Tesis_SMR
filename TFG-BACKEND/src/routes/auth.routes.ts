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
router.get('/google', passport.authenticate('auth-google', { scope: ['profile', 'email'] }))

router.get('/microsoft', passport.authenticate('auth-microsoft'))

router.get(
  '/google/callback',
  passport.authenticate('auth-google', { session: false }),
  googleLogin // or a dedicated googleCallback controller if you have one
)

// Who am I
router.get('/whoami', [checkSession, validateFields], whoAmI)

export default router
