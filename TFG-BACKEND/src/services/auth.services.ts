import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/user'
import { verify } from '../utils/bcrypt'
import { decodeToken, signToken } from '../utils/jwt'
import { Role } from '../models/role'

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
})

export const loginService = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      throw new Error('User not found')
    }

    const isCorrect = await verify(password, user.password)

    // Check if password is correct
    if (!isCorrect) {
      throw new Error('Invalid credentials')
    }

    // Generate token
    const token = signToken(user._id.toString())

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  } catch (error) {
    console.error('Error in login service:', error)
    throw new Error('Error logging in')
  }
}

export const verifyTokenService = async (token: string) => {
  try {
    const decodedToken = decodeToken(token)
    return decodedToken
  } catch (error) {
    throw new Error('Token inválido')
  }
}

export const googleLoginService = async (code: string) => {
  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) throw new Error('No id_token returned from Google');

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) throw new Error('Invalid Google token')

    const { email, name } = payload

    if (!email) throw new Error('Google account has no email')

    // Only allow users that exist in the database
    const user = await User.findOne({ email }).populate('role')
    if (!user) {
      throw new Error('User not authorized. Please contact the administrator.')
    }

    const token = signToken(user._id.toString())

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  } catch (error) {
    console.error('Error in Google login:', error)
    throw new Error('Google login failed')
  }
}

export const whoAmIService = async (token: string) => {
  try {
    const decodedToken = decodeToken(token)
    const userId = decodedToken?.id

    const user = await User.findById(userId).populate('role')

    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role
    }
  } catch (error) {
    console.error('Error in whoAmI service:', error)
    throw new Error('Error fetching user information')
  }
}