import { externalApiClient } from '../utils/externalApiClient'

export const fetchReservations = async (
  startDateTime: string,
  endDateTime: string
) => {
  try {
    const response = await externalApiClient.get('/Reservations/', {
      params: {
        startDateTime,
        endDateTime
      }
    })

    return response.data
  } catch (error) {
    console.error('❌ Error fetching reservations:', error)
    throw new Error('Error fetching reservations')
  }
}
