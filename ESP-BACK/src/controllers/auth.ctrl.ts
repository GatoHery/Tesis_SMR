import { Request, Response } from 'express'
import {
  googleLoginService,
  loginService,
  whoAmIService
} from '../services/auth.services'
import { User } from '../models/user'
import { signToken } from '../utils/jwt'
import { Role } from '../models/role'

export const login = async ({ body }: Request, res: Response) => {
  try {
    const { email, password } = body

    const response = await loginService(email, password)

    res.cookie('token', response.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json(response)
  } catch (error: any) {
    console.error('Error in login controller:', error.message)
    if (!res.headersSent) {
      res.status(400).json({ message: error.message || 'Login failed' })
    }
  }
}

export const googleLogin = async ({ body }: Request, res: Response) => {
  try {
    const { code } = body

    const response = await googleLoginService(code)

    res.cookie('token', response.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json(response)
  } catch (error: any) {
    console.error('Error in Google login controller:', error.message)
    if (!res.headersSent) {
      res.status(400).json({ message: error.message || 'Google login failed' })
    }
  }
}

export const microsoftCallback = async (req: Request, res: Response) => {
  try {
    const profile = req.user as any

    if (!profile || !profile.emails || profile.emails.length === 0) {
      res.status(400).json({ message: 'No email found in Microsoft profile' })
    }

    const email = profile.emails[0].value
    const name = profile.displayName

    // Only allow login for existing users
    const user = await User.findOne({ email }).populate('role')
    if (!user) {
      res.status(401).send(`
        <!DOCTYPE html>
        <html>
          <body>
            <script>
              window.opener.postMessage(
                { error: "User not authorized. Please contact administrator." },
                "http://localhost:5173"
              );
              window.close();
            </script>
          </body>
        </html>
      `)
      return
    }

    // Generate JWT
    const token = signToken(user._id.toString())
    const userString = JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })

    res.send(`
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { user: ${userString}, token: "${token}" },
              "http://localhost:5173"
            );
            window.close();
          </script>
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Microsoft callback error:', error)
    res.status(500).json({ message: 'Microsoft login failed' })
  }
}

export const whoAmI = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token

    const userInfo = await whoAmIService(token)

    res.status(200).json(userInfo)
  } catch (error) {
    console.error('Error in whoAmI controller:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
