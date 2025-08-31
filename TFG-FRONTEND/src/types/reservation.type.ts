export interface Reservation {
  title: string;
  resourceName: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ReservationStats {
  currentCount: number,
  previousCount: number,
  difference: number,
  percentChange: number
}
