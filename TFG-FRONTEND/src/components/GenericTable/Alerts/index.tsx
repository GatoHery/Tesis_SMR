import GenericTable from "@/components/GenericTable";
import { getAlertColumns } from "@/components/GenericTable/Alerts/Columns";
import useAlertStore from "@/store/alert.store";

type AlertsTableProps = {
  onPageSizeChange?: (size:number) => void;
}

const AlertsTable = ({onPageSizeChange}: AlertsTableProps) => {
  const { alerts, loading } = useAlertStore();
  // const data: Alert[] = [
  //   {
  //     id: "1",
  //     sensorLocation: "Laboratorio 2",
  //     decibels: "76 dB",
  //     timestamp: "2025-10-01T12:00:00Z",
  //   },
  //   {
  //     id: "2",
  //     sensorLocation: "Laboratorio 1",
  //     decibels: "77 dB",
  //     timestamp: "2025-10-02T12:00:00Z",
  //   },
  //   {
  //     id: "3",
  //     sensorLocation: "Laboratorio 4",
  //     decibels: "83 dB",
  //     timestamp: "2025-10-03T12:00:00Z",
  //   },
  //   {
  //     id: "4",
  //     sensorLocation: "Laboratorio 4",
  //     decibels: "66 dB",
  //     timestamp: "2025-10-03T12:00:00Z",
  //   },
  //   {
  //     id: "5",
  //     sensorLocation: "Laboratorio 7",
  //     decibels: "73 dB",
  //     timestamp: "2025-10-03T12:00:00Z",
  //   },
  // ];

  return (
    <GenericTable
      columns={getAlertColumns()}
      loading={loading}
      dataSource={alerts}
      rowKey={(record) => record.uid}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50", "100"],
        onShowSizeChange: (_, size) => {
          onPageSizeChange?.(size);
        },
      }}
    />
  );
};

export default AlertsTable;
