import { Request, Response } from "express";
import { fetchReservations } from "../services/reservation.services";
import { title } from "process";
import { getWeekRange } from "../utils/date";
import { Server as SocketIOServer } from "socket.io";
import { broadcastData } from "../utils/websocketConnection";

export const getReservations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDateTime, endDateTime } = req.query;

    const io = req.app.get("io") as SocketIOServer;

    if (!startDateTime || !endDateTime) {
      res.status(400).json({ message: "Missing date parameters" });
      broadcastData(io, "MisingDateParameters", {
        message: "Missing date parameters",
      });
      return;
    }

    const data = await fetchReservations(
      startDateTime as string,
      endDateTime as string
    );

    const simplifiedReservations = data.reservations.map(
      (reservation: any) => ({
        title: reservation.title,
        resourceName: reservation.resourceName,
        description: reservation.description,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
      })
    );

    res.status(200).json(simplifiedReservations);
    broadcastData(io, "fetchedReservations", simplifiedReservations);
  } catch (error) {
    console.error("Error getting reservations:", error);
    res.status(500).json({ message: "Error getting reservations" });
  }
};

export const getWeeklySummary = async (_: Request, res: Response) => {
  const io = _.app.get("io") as SocketIOServer;

  try {
    const today = new Date();
    // esta semana
    const { startISO: currentStart, endISO: currentEnd } = getWeekRange(
      today,
      0
    );
    // semana anterior
    const { startISO: prevStart, endISO: prevEnd } = getWeekRange(today, -1);

    // llamamos al API externo
    const currentData = await fetchReservations(currentStart, currentEnd);
    const previousData = await fetchReservations(prevStart, prevEnd);

    const currentCount = currentData.reservations.length;
    const previousCount = previousData.reservations.length;
    const difference = currentCount - previousCount;
    const percentChange =
      previousCount > 0 ? (difference / previousCount) * 100 : null;

    res.status(200).json({
      currentCount,
      previousCount,
      difference,
      percentChange:
        percentChange !== null ? Number(percentChange.toFixed(2)) : null,
    });

    const objectSummary = {
      count: currentCount,
      prevCount: previousCount,
      dif: difference,
      perc: percentChange !== null ? Number(percentChange.toFixed(2)) : null,
    };

    broadcastData(io, "weeklySummary", objectSummary);
  } catch (error) {
    console.error("Error computing weekly summary:", error);
    res.status(500).json({ message: "Error computing weekly summary" });
  }
};
