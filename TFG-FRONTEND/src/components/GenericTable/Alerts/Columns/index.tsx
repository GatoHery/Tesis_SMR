import { Alert } from "@/types/alert.type";
import { TableProps } from "antd";

export const getAlertColumns = (): TableProps<Alert>["columns"] => {
  return [
    {
      title: '',
      dataIndex: 'index',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Ubicación",
      dataIndex: "sensorLocation",
      key: "sensorLocation",
    },
    {
      title: "Fecha de creación",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (_, record) => {
        return new Date(record.timestamp).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Nivel",
      dataIndex: "decibels",
      key: "decibels",
      render: (_, record) => {
        return `${record.decibels} dB`;
      },
    },
  ];
}