import cron from "node-cron";
import { evaluateSensorsAgainstReservations } from "../services/reservation.sensor.services";

export const startReservationSensorJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("🔔 Running reservation sensor job...");
      await evaluateSensorsAgainstReservations();
    } catch (error) {
      console.error("❌ Error in reservation sensor job:", error);
    }
    console.log("🔄 Evaluating sensors against reservations...");
    await evaluateSensorsAgainstReservations();
  });
};
