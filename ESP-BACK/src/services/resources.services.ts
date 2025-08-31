import { externalApiClient } from '../utils/externalApiClient'

export const fetchResources = async () => {
  const response = await externalApiClient.get('/Resources')
  return response.data
}
