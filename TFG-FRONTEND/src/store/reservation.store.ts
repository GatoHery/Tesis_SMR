import { Reservation, ReservationStats } from "@/types/reservation.type";
import { reservationService } from "@/services/reservation.service";
import { create } from "zustand";
import { Dayjs } from "dayjs";
import socket from "@/services/socket.client";
import { Slide, toast } from "react-toastify";
import useThemeStore from "./theme.store";

type ReservationState = {
  reservations: Reservation[];
  stats: ReservationStats;
  loading: boolean;
  loadingStats: boolean;
  error: string | null;
  websocketEvent: number;
  clearWebsocketEvent: () => void;
  fetchReservations: (from: Dayjs, to: Dayjs) => Promise<void>;
  fetchReservationsStats: () => Promise<void>;
  initializeWebsocket: () => void;
};

const { darkMode } = useThemeStore();

const initialStats: ReservationStats = {
  currentCount: 0,
  previousCount: 0,
  difference: 0,
  percentChange: 0,
};

const useReservationStore = create<ReservationState>()((set) => ({
  reservations: [],
  stats: initialStats,
  loading: false,
  loadingStats: false,
  error: null,
  websocketEvent: 0,
  clearWebsocketEvent: () => set({ websocketEvent: 0 }),
  fetchReservations: async (from, to) => {
    try {
      set({ loading: true });
      const data = await reservationService.fetchReservations(
        from.toISOString(),
        to.toISOString()
      );

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
      set({
        loadingStats: false,
        error: "Failed to fetch reservations stats...",
      });
    }
  },

  initializeWebsocket: () => {
    socket.off("weekly summary");
    socket.on("weekly summary", (data: ReservationStats) => {
      console.log("Received weekly summary via websocket: ", data);
      toast.success("Datos de resumen semanal actualizados", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light",
        transition: Slide,
      });

      set({ stats: data });
    });
  },
}));

export default useReservationStore;
