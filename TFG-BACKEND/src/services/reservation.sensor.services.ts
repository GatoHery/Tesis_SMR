import { fetchReservations } from './reservation.services'
import { SensorDevice } from '../models/sensorDevice'

export const evaluateSensorsAgainstReservations = async () => {
  const fechaDeHoy = new Date()

  const inicioDelDia = new Date(fechaDeHoy)
  inicioDelDia.setHours(0, 0, 0, 0)

  const finDelDia = new Date(fechaDeHoy)
  finDelDia.setHours(23, 59, 59, 999)

  const data = await fetchReservations(
    inicioDelDia.toISOString(),
    finDelDia.toISOString()
  )

  const reservations = data.reservations

  const sensors = await SensorDevice.find()

  for (const sensor of sensors) {
    const reservaActiva = reservations.some((reserva: any) => {
      if (reserva.resourceName !== sensor.location) return false

      const inicio = new Date(reserva.startDate)
      const fin = new Date(reserva.endDate)

      return fechaDeHoy >= inicio && fechaDeHoy <= fin
    })

    const activacion = !reservaActiva

    if (
      sensor.alarm !== activacion ||
      sensor.notifications !== activacion
    ) {
      sensor.alarm = activacion
      sensor.notifications = activacion
      await sensor.save()
    }
  }
}
