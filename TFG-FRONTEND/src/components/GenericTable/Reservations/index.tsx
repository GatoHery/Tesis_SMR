import GenericTable from "@/components/GenericTable";
import { getReservationColumns } from "./Columns";
import useReservationStore from "@/store/reservation.store";

const ReservationsTable = () => {
  const { reservations, loading } = useReservationStore();

  return (
    <GenericTable
      columns={getReservationColumns()}
      dataSource={reservations}
      loading={loading}
      rowKey={(record) => record.title + record.startDate + record.endDate + record.resourceName + record.description}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50", "100"],
      }}
    />
  )
}

export default ReservationsTable
