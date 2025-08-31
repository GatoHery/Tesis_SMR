// ** AntD Imports
import { Card, Empty, Flex, theme, Typography } from 'antd';

// ** Third Party Imports
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// ** Zustand Store Imports
import useThemeStore from '@/store/theme.store';
import useDashboardStore from '@/store/dashboard.store';
import { useEffect } from 'react';

const Linechart = () => {
  const { darkMode } = useThemeStore();
  const { hourlyStats, loadingHourly, fetchHourlyStats } = useDashboardStore();
  const {
    token: { colorPrimary, colorError, colorBgContainer },
  } = theme.useToken();

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      background: colorBgContainer,
      foreColor: darkMode ? "#ffffff" : "#000000",
    },
    theme: {
      mode: darkMode ? "dark" : "light",
    },
    grid: {
      show: true,
      borderColor: darkMode ? "#444" : "#e0e0e0",
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 4,
      curve: "smooth",
    },
    colors: [colorPrimary, colorError],
    xaxis: {
      labels: {
        style: {
          colors: darkMode ? "#ffffff" : "#000000",
          fontSize: "14px",
          fontWeight: 400
        },
      },
      categories: hourlyStats.labels,
    },
    markers: {
      size: 4.5,
      colors: [colorBgContainer],
      strokeColors: [colorPrimary],
      hover: {
        size: 5.5,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: darkMode ? "#ffffff" : "#000000",
          fontSize: "14px",
          fontWeight: 400
        },
      },
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
    },
    legend: {
      show: false,
    }
  };

  const series = [
    {
      name: "Nivel",
      data: hourlyStats.values,
    },
  ];

  useEffect(() => {
    fetchHourlyStats();
  }, [fetchHourlyStats]);

  return (
    <>
      <Card variant="borderless" loading={loadingHourly}>
        {
          
        }
        {
          hourlyStats.values.length === 0 ?
            <Flex justify="center" align="center" style={{ height: "100%", width: "100%" }} vertical>
              <Empty description="No hay datos del día disponibles" />
            </Flex>
            :
            <>
              <Typography.Title level={5}>Niveles de ruido</Typography.Title>
              <Typography.Paragraph type="secondary">
                Promedio de ruido en la últimas 24 horas
              </Typography.Paragraph>
              <ReactApexChart
                options={options}
                series={series}
                type="line"
                width={"100%"}
                height={350}
              />
            </>
        }
      </Card>

    </>
  )
}

export default Linechart