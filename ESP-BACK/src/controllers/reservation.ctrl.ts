import { Request, Response } from 'express'
import { fetchReservations } from '../services/reservation.services'
import { title } from 'process'

export const getReservations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDateTime, endDateTime } = req.query

    if (!startDateTime || !endDateTime) {
      res.status(400).json({ message: 'Missing date parameters' })
      return
    }

    const data = await fetchReservations(
      startDateTime as string,
      endDateTime as string
    )

    const simplifiedReservations = data.reservations.map(
      (reservation: any) => ({
        title: reservation.title,
        resourceName: reservation.resourceName,
        description: reservation.description,
        startDate: reservation.startDate,
        endDate: reservation.endDate
      })
    )

    res.status(200).json(simplifiedReservations)
  } catch (error) {
    console.error('Error getting reservations:', error)
    res.status(500).json({ message: 'Error getting reservations' })
  }
}
