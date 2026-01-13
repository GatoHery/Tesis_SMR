import { fetchReservations } from "./reservation.services";
import { SensorDevice } from "../models/sensorDevice";

export const evaluateSensorsAgainstReservations = async () => {
  const todayDate = new Date();

  const startOfDay = new Date(todayDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(todayDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await fetchReservations(
    startOfDay.toISOString(),
    endOfDay.toISOString()
  );

  const reservations = data.reservations;

  const sensors = await SensorDevice.find();

  for (const sensor of sensors) {
    const activeReservation = reservations.some((reserva: any) => {
      if (reserva.resourceName !== sensor.location) return false;

      const start = new Date(reserva.startDate);
      const end = new Date(reserva.endDate);

      return todayDate >= start && todayDate <= end;
    });

    const activacionFlag = !activeReservation;

    if (
      sensor.alarm !== activacionFlag ||
      sensor.notifications !== activacionFlag
    ) {
      sensor.alarm = activacionFlag;
      sensor.notifications = activacionFlag;
      await sensor.save();
    }
  }
};
