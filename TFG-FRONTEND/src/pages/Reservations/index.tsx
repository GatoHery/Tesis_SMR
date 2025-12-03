// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Imports
import { Card, Col, DatePicker, Flex, Row, theme, Typography } from "antd";
import { BiCalendar } from "react-icons/bi";
import dayjs, { Dayjs } from "dayjs";

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";

// ** Custom Components Imports
import DataCardList from "@/components/DataCardList";
import ReservationsTable from "@/components/GenericTable/Reservations";
import useReservationStore from "@/store/reservation.store";

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

const presets = [
  {
    label: "Hoy",
    value: () =>
      [dayjs().startOf("day"), dayjs().endOf("day")] as [Dayjs, Dayjs],
  },
  {
    label: "Ayer",
    value: () =>
      [
        dayjs().subtract(1, "day").startOf("day"),
        dayjs().subtract(1, "day").endOf("day"),
      ] as [Dayjs, Dayjs],
  },
  {
    label: "Últimos 7 días",
    value: () =>
      [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")] as [
        Dayjs,
        Dayjs
      ],
  },
  {
    label: "Últimos 30 días",
    value: () =>
      [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")] as [
        Dayjs,
        Dayjs
      ],
  },
  {
    label: "Mes actual",
    value: () =>
      [
        dayjs().startOf("month").startOf("day"),
        dayjs().endOf("month").endOf("day"),
      ] as [Dayjs, Dayjs],
  },
  {
    label: "Mes pasado",
    value: () =>
      [
        dayjs().subtract(1, "month").startOf("month").startOf("day"),
        dayjs().subtract(1, "month").endOf("month").endOf("day"),
      ] as [Dayjs, Dayjs],
  },
];

const Reservations = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("day"),
    dayjs().endOf("day"),
  ]);
  const { token } = theme.useToken();
  const { darkMode } = useThemeStore();
  const {
    fetchReservations,
    fetchReservationsStats,
    stats,
    loadingStats,
    initializeWebsocket,
    clearWebsocketEvent,
    websocketEvent,
  } = useReservationStore();

  const data = [
    {
      title: "Total Reservas",
      value: stats.currentCount,
      change: stats.difference,
      icon: (
        <BiCalendar size={24} color={darkMode ? "#fff" : token.colorPrimary} />
      ),
      description: "desde la semana pasada",
    },
  ];

  useEffect(() => {
    initializeWebsocket();
  }, []);

  useEffect(() => {
    fetchReservations(range[0].startOf("day"), range[1].endOf("day"));
  }, [range, fetchReservations]);

  useEffect(() => {
    fetchReservationsStats();
  }, [fetchReservationsStats]);

  useEffect(() => {
    if (!websocketEvent) return;

    clearWebsocketEvent();
  }, [websocketEvent, clearWebsocketEvent]);

  return (
    <Flex vertical gap={24}>
      <Row>
        <Col>
          <Title level={2}>Reservas</Title>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <DataCardList data={data} loading={loadingStats} />
      </Row>

      <Row>
        <Col xs={24}>
          <Card variant="borderless">
            <div className="filter-header">
              <Flex vertical gap={4}>
                <Title level={5}>Reservas de laboratorios</Title>
                <Paragraph type="secondary">Últimas 5 reservas</Paragraph>
              </Flex>
              <Flex style={{ marginBottom: "16px" }} gap={8} align="center">
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Fechas:
                </Paragraph>
                <RangePicker
                  style={{ width: 175 }}
                  presets={presets}
                  value={range}
                  onChange={(values) => {
                    if (values && values[0] && values[1])
                      setRange([values[0], values[1]]);
                  }}
                  format="MMM D"
                  allowClear={false}
                  placement="bottomLeft"
                  placeholder={["Desde", "Hasta"]}
                />
              </Flex>
            </div>

            <div className="ant-list-box table-responsive">
              <ReservationsTable />
            </div>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};

export default Reservations;
