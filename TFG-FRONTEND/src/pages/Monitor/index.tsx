import { useEffect, useState } from "react";
import { Col, Flex, Row, Spin, Tabs, TabsProps, Typography } from "antd";
import MonitorCard from "@/components/MonitorCard";
import useResourceStore from "@/store/resource.store";
import useSensorStore from "@/store/sensor.store";
import { Slide, toast } from "react-toastify";
import useThemeStore from "@/store/theme.store";

const Sensors = () => {
  const {
    sensors,
    loading,
    fetchSensors,
    initializeWebsocket,
    websocketEvent,
    clearWebsocketEvent,
  } = useSensorStore();

  const { darkMode } = useThemeStore();

  useEffect(() => {
    fetchSensors();
    initializeWebsocket();
  }, [fetchSensors]);

  useEffect(() => {
    if (!websocketEvent) return;

    /* message.success("Datos de promedios semanales actualizados"); */
    toast.success("Datos de sensores actualizados", {
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
          <Spin size="large" tip="Cargando sensores..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <MonitorCard
                key={sensor.ip}
                type="sensor"
                ip={sensor.ip}
                name={sensor.name}
                description={sensor.location}
                currentReading={sensor.currentReading}
                // lastAlert={sensor.lastAlert}
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

  const { darkMode } = useThemeStore();

  useEffect(() => {
    fetchResources();
    initializeWebsocket();
  }, [fetchResources]);

  useEffect(() => {
    if (!websocketEvent) return;

    /* message.success("Datos de promedios semanales actualizados"); */
    toast.success("Datos de recursos actualizados", {
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
