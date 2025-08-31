import { Reservation, ReservationStats } from "@/types/reservation.type";
import { reservationService } from "@/services/reservation.service";
import { create } from "zustand";
import { Dayjs } from "dayjs";

type ReservationState = {
  reservations: Reservation[];
  stats: ReservationStats;
  loading: boolean;
  loadingStats: boolean;
  error: string | null;
  fetchReservations: (from: Dayjs, to: Dayjs) => Promise<void>;
  fetchReservationsStats: () => Promise<void>;
}

const initialStats: ReservationStats = {
  currentCount: 0,
  previousCount: 0,
  difference: 0,
  percentChange: 0,
}


const useReservationStore = create<ReservationState>()(
  (set) => ({
    reservations: [],
    stats: initialStats,
    loading: false,
    loadingStats: false,
    error: null,

    fetchReservations: async (from, to) => {
      try {
        set({ loading: true });
        const data = await reservationService.fetchReservations(from.toISOString(), to.toISOString());

        set({
          reservations: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching alerts: ", error);
        set({ loading: false, error: "Failed to fetch alerts..." });
      }
    },

    fetchReservationsStats: async () => {
      try {
        set({ loadingStats: true });
        const data = await reservationService.fetchReservationsStats();

        set({
          stats: data,
          loadingStats: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching reservations stats: ", error);
        set({ loadingStats: false, error: "Failed to fetch reservations stats..." });
      }
    },
  })
);

export default useReservationStore;