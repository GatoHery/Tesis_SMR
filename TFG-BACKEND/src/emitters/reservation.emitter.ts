import { Server as SocketIOServer } from "socket.io";

import { fetchReservations } from "../services/reservation.services";
import { getWeekRange } from "../utils/date";

export const reservationEmitter = {
  emitWeeklyReservationSummary: (io: SocketIOServer, intervalMs = 60000) => {
    setInterval(async () => {
      try {
        const today = new Date();
        const { startISO: currentStart, endISO: currentEnd } = getWeekRange(
          today,
          0
        );
        const { startISO: prevStart, endISO: prevEnd } = getWeekRange(
          today,
          -1
        );

        const currentData = await fetchReservations(currentStart, currentEnd);
        const previousData = await fetchReservations(prevStart, prevEnd);

        const currentCount = currentData.reservations.length;
        const previousCount = previousData.reservations.length;
        const difference = currentCount - previousCount;
        const percentChange =
          previousCount > 0 ? (difference / previousCount) * 100 : null;

        const objectSummary = {
          count: currentCount,
          prevCount: previousCount,
          dif: difference,
          perc:
            percentChange !== null ? Number(percentChange.toFixed(2)) : null,
        };

        /* broadcastData(io, "weeklySummary", objectSummary); */
        io.emit("weekly summary", objectSummary);
      } catch (error) {
        console.error("Error broadcasting reservation summary: ", error);
      }
    }, intervalMs);
  },
};
