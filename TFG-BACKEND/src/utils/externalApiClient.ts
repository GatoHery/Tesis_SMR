import axios from 'axios'
import {
  authenticateExternalApi,
  getSessionToken,
  getUserId
} from '../services/externalAuth.services'

export const externalApiClient = axios.create({
  baseURL: 'http://fia.uca.edu.sv/reservas/Web/Services/index.php'
})

// intercept request to add session token and user ID
externalApiClient.interceptors.request.use(async config => {
  const token = await getSessionToken()
  const user = await getUserId()

  config.headers['X-Booked-SessionToken'] = token
  config.headers['X-Booked-UserId'] = user

  return config
})

// intercept response to handle 401 errors
externalApiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // if the error is 401 and the request has not been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true // retry flag
      await authenticateExternalApi() // reauthenticate
      return externalApiClient(originalRequest) // retry the original request
    }

    return Promise.reject(error)
  }
)
