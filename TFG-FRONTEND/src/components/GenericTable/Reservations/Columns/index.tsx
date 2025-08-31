import { Reservation } from "@/types/reservation.type";
import { TableProps } from "antd";

export const getReservationColumns = (): TableProps<Reservation>["columns"] => {
  return [
    {
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Nombre",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Ubicación",
      dataIndex: "resourceName",
      key: "resourceName",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text) => {
        return text ? text : "Sin descripción";
      },
    },
    {
      title: "Inicio",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (text) => {
        return new Date(text).toLocaleString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    {
      title: "Final",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (text) => {
        return new Date(text).toLocaleString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    }
  ];
};
