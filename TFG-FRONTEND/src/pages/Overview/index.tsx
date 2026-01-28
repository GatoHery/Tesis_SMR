// ** Third Party Imports
import { Card, Col, Flex, Row, theme, Typography } from "antd";
import { BsBuilding } from "react-icons/bs";
import { FiActivity, FiVolume2 } from "react-icons/fi";
import { TiWarningOutline } from "react-icons/ti";

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";

// ** Custom Componets Imports
import Barchart from "@/components/Charts/Barchart";
import Linechart from "@/components/Charts/Linechart";
import DataCardList from "@/components/DataCardList";
import AlertsTable from "@/components/GenericTable/Alerts";
import { useEffect, useState } from "react";
import useAlertStore from "@/store/alert.store";
import useDashboardStore from "@/store/dashboard.store";

const Overview = () => {
  const { token } = theme.useToken();
  const { darkMode } = useThemeStore();
  const { fetchAlerts } = useAlertStore();
  const {
    metrics,
    fetchMetrics,
    loading,

  } = useDashboardStore();

  const { Title, Paragraph } = Typography;

  const data = [
    {
      title: "Ruido promedio",
      value: metrics.noise.value,
      change: metrics.noise.change,
      icon: (
        <FiVolume2 size={24} color={darkMode ? "#fff" : token.colorPrimary} />
      ),
      description: "desde la semana pasada",
      descriptionSuffix: "%",
      valueSuffix: "dB",
    },
    {
      title: "Laboratorios monitoreados",
      value: metrics.labsMonitored.value,
      change: metrics.labsMonitored.change,
      icon: (
        <BsBuilding size={24} color={darkMode ? "#fff" : token.colorPrimary} />
      ),
      description: "desde la semana pasada",
    },
    {
      title: "Máx. Ruido alcanzado",
      value: metrics.maxDbs.value,
      change: metrics.maxDbs.change,
      icon: (
        <TiWarningOutline
          size={24}
          color={darkMode ? "#fff" : token.colorPrimary}
        />
      ),
      valueSuffix: "dB",
      description: "desde la semana pasada",
    },
    {
      title: "Actividad de sensores",
      value: metrics.sensorActivity.value,
      change: metrics.sensorActivity.change,
      icon: (
        <FiActivity size={24} color={darkMode ? "#fff" : token.colorPrimary} />
      ),
      description: "desde la semana pasada",
    },
  ];

  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAlerts();
    fetchMetrics();

    const interval = setInterval(() => {
      fetchAlerts();
      fetchMetrics();
    }, 60000);

    return () => clearInterval(interval); // cada 60s re-evalúa

  }, [fetchAlerts, fetchMetrics]);

  return (
    <>
      <Flex vertical gap={24}>
        <Row>
          <Col>
            <Title level={2}>Tablero</Title>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <DataCardList data={data} loading={loading} />
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12}>
            <Linechart />
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Barchart />
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Card variant="borderless">
              <Title level={5}>Alertas recientes</Title>
              <Paragraph type="secondary">
                Últimas {pageSize} alertas registradas
              </Paragraph>
              <div className="ant-list-box table-responsive">
                <AlertsTable onPageSizeChange={setPageSize} />
              </div>
            </Card>
          </Col>
        </Row>
      </Flex>
    </>
  );
};

export default Overview;
