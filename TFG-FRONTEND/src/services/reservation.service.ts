import api from "@/api/axiosInstance";

const RESERVATION_PATH = '/api/reservations';

export const reservationService = {

  fetchReservations: async (startDateTime: string, endDateTime: string) => {
    const res = await api.get(`${RESERVATION_PATH}`, {
      params: {
        startDateTime,
        endDateTime
      },
      withCredentials: true
    });

    return res.data;
  },

  fetchReservationsStats: async () => {
    const res = await api.get(`${RESERVATION_PATH}/weekly-summary`, {
      withCredentials: true
    });

    return res.data;
  },
}
