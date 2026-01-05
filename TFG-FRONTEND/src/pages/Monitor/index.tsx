import { useEffect, useState } from "react";
import { Col, Flex, Row, Spin, Tabs, TabsProps, Typography } from "antd";
import MonitorCard from "@/components/MonitorCard";
import useResourceStore from "@/store/resource.store";
import useSensorStore from "@/store/sensor.store";

const Sensors = () => {
  const {
    sensors,
    loading,
    fetchSensors,
    initializeWebsocket,
    websocketEvent,
    clearWebsocketEvent,
  } = useSensorStore();

  useEffect(() => {
    fetchSensors();
    initializeWebsocket();
  }, [fetchSensors]);

  useEffect(() => {
    if (!websocketEvent) return;

    clearWebsocketEvent();
  }, [websocketEvent, clearWebsocketEvent]);

  /* variable para poder determinar el tiempo de inactividad de un sensor */
  const ACTIVE_WINDOWS_MS = 5 * 60 * 1000; // 5 minutos en milisegundos

  const activeSensors = sensors.map((sensor) => {
    const lastReadingTime = new Date(sensor.updatedAt).getTime();
    const currentTime = Date.now();

    const isActive = currentTime - lastReadingTime <= ACTIVE_WINDOWS_MS;

    return { ...sensor, isActive };
  });

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spin size="large" tip="Cargando sensores..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {activeSensors.length > 0 ? (
            activeSensors.map((sensor) => (
              <MonitorCard
                key={sensor.ip}
                type="sensor"
                ip={sensor.ip}
                name={sensor.name}
                description={sensor.location}
                currentReading={sensor.currentReading}
                lastAlert={sensor.lastAlert}
                threshold={sensor.threshold}
                notifications={sensor.notifications}
                alarm={sensor.alarm}
              />
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
              <Typography.Paragraph
                type="secondary"
                style={{ textAlign: "center" }}
              >
                No hay sensores disponibles
              </Typography.Paragraph>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

const Locations = () => {
  const {
    resources,
    loading,
    fetchResources,
    initializeWebsocket,
    websocketEvent,
    clearWebsocketEvent,
  } = useResourceStore();

  useEffect(() => {
    fetchResources();
    initializeWebsocket();
  }, [fetchResources]);

  useEffect(() => {
    if (!websocketEvent) return;

    clearWebsocketEvent();
  }, [websocketEvent, clearWebsocketEvent]);
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spin size="large" tip="Cargando ubicaciones..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {resources.length > 0 ? (
            resources.map((location) => (
              <MonitorCard
                key={location.name}
                type="location"
                name={location.name}
                description={location.location}
                maxParticipants={location.maxParticipants}
              />
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
              <Typography.Paragraph
                type="secondary"
                style={{ textAlign: "center" }}
              >
                No hay ubicaciones disponibles
              </Typography.Paragraph>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

const Monitor = () => {
  const [selectedTab, setSelectedTab] = useState("sensors");
  const { Title } = Typography;

  const items: TabsProps["items"] = [
    {
      key: "sensors",
      label: `Sensores`,
      children: <Sensors />,
    },
    {
      key: "locations",
      label: "Ubicaciones",
      children: <Locations />,
    },
  ];

  return (
    <>
      <Flex vertical gap={24}>
        <Row>
          <Col>
            <Title level={2}>Monitor</Title>
          </Col>
        </Row>

        <Tabs items={items} activeKey={selectedTab} onChange={setSelectedTab} />
      </Flex>
    </>
  );
};

export default Monitor;
