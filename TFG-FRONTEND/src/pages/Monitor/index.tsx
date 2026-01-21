import { useEffect, useState } from "react";
import { Col, Flex, Row, Spin, Tabs, TabsProps, Typography } from "antd";
import MonitorCard from "@/components/MonitorCard";
import useResourceStore from "@/store/resource.store";
import useSensorStore from "@/store/sensor.store";

const Sensors = () => {
  const { sensors, loading, fetchSensors } = useSensorStore();

  const TIEMPO_ESPERA = 2 * 60 * 1000; // 2 minutos en milisegundos
  const [actualDate, setActualDate] = useState(Date.now());

  useEffect(() => {
    fetchSensors();

    const interval = setInterval(() => {
      fetchSensors();
      setActualDate(Date.now());
    }, 60000);

    return () => clearInterval(interval); // cada 60s re-evalúa
  }, [fetchSensors]);

  /* buscando sensores activos */
  const activeSensors = sensors.filter((sensor) => {
    const date = new Date(sensor.updatedAt);

    const localTime = date.getTime() - date.getTimezoneOffset() * 60000;
    const diff = actualDate - localTime;
    return diff <= TIEMPO_ESPERA;
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
  const { resources, loading, fetchResources } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

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
