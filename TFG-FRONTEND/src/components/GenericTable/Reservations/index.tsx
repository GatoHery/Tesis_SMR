import GenericTable from "@/components/GenericTable";
import { getReservationColumns } from "./Columns";
import useReservationStore from "@/store/reservation.store";
/* import { useEffect } from "react"; */

type ReservationsTableProps = {
  onPageSizeChange?: (size:number) => void;
}

const ReservationsTable = ({ onPageSizeChange }: ReservationsTableProps) => {
  const { reservations, loading, /* initializeWebsocket  */} = useReservationStore();

/*   useEffect(() => {
    initializeWebsocket();
  }, []); */

  return (
    <GenericTable
      columns={getReservationColumns()}
      dataSource={reservations}
      loading={loading}
      rowKey={(record) =>
        record.title +
        record.startDate +
        record.endDate +
        record.resourceName +
        record.description
      }
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50", "100"],
        onShowSizeChange: (_, size) => {
          onPageSizeChange?.(size);
        },
      }}
    />
  );
};

export default ReservationsTable;
