// ** Third Party Imports
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";
import useDashboardStore from "@/store/dashboard.store";
import { useEffect } from "react";
import { Card, Empty, Flex, Typography } from "antd";

const Barchart = () => {
  const { weeklyAverages, loadingWeekly, fetchWeeklyAverages } =
    useDashboardStore();
  const { darkMode } = useThemeStore();

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      borderColor: darkMode ? "#444" : "#e0e0e0",
      strokeDashArray: 2,
    },
    xaxis: {
      categories: weeklyAverages.labels,
      labels: {
        show: true,
        style: {
          colors: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: darkMode ? "#ffffff" : "#000000",
        },
      },
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
    },
  };

  const series = [
    {
      name: "Tests",
      data: weeklyAverages.values,
      color: "rgba(44,81,180,0.75)",
    },
  ];

  useEffect(() => {
    fetchWeeklyAverages();
  }, []);

  return (
    <>
      <Card variant="borderless" className="chart-card" loading={loadingWeekly}>
        {weeklyAverages.values.length === 0 ? (
          <Flex
            justify="center"
            align="center"
            style={{ height: "100%", width: "100%" }}
            vertical
          >
            <Empty description="No hay datos semanales disponibles" />
          </Flex>
        ) : (
          <>
            <Typography.Title level={5}>Ruido por laboratorio</Typography.Title>
            <Typography.Paragraph type="secondary">
              Promedio de nivel de ruido por laboratorio en la última semana
            </Typography.Paragraph>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default Barchart;
