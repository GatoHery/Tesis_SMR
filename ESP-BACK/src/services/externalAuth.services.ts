import axios from 'axios'

let sessionToken: string | null = null
let userId: string | null = null
let authenticating = false // to avoid multiple concurrent authentications

export const authenticateExternalApi = async () => {
  try {
    console.log('🔄 Authenticating with External API...')

    const response = await axios.post(
      'https://fia.uca.edu.sv/reservas/Web/Services/index.php/Authentication/Authenticate',
      {
        username: process.env.EXTERNAL_API_USER,
        password: process.env.EXTERNAL_API_PASS
      }
    )

    if (response.data.isAuthenticated) {
      sessionToken = response.data.sessionToken
      userId = response.data.userId
      console.log('✅ Authenticated successfully')
    } else {
      throw new Error('External API authentication failed')
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error)
    throw new Error('Authentication failed')
  }
}

export const getSessionToken = async () => {
  if (!sessionToken) {
    await authenticateExternalApi()
  }
  return sessionToken
}

export const getUserId = async () => {
  if (!userId) {
    await authenticateExternalApi()
  }
  return userId
}
