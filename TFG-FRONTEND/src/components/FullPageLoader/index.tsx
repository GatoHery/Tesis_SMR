// components/FullPageLoader.tsx
import { Flex, Spin, theme, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface FullPageLoaderProps {
  message?: string;
}

const FullPageLoader = ({ message = "Loading application..." }: FullPageLoaderProps) => {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100vh",
        flexDirection: "column",
        backgroundColor: token.colorBgLayout,
      }}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        size="large"
        style={{ marginBottom: 16 }}
      />
      <Text type="secondary">{message}</Text>
    </Flex>
  );
};

export default FullPageLoader;
