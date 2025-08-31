import { Flex, Typography } from "antd"

type ErrorProps = {
  error: string | null;
}

const Error = ({ error }: ErrorProps) => {
  const { Title, Paragraph } = Typography;

  return (
    <>
      {
        error ?
          <Flex vertical justify="center" align="center">
            <Title level={5}>Error</Title>
            <Paragraph type="secondary">
              {error}
            </Paragraph>
          </Flex>
          :
          <Flex vertical justify="center" align="center">
            <Title level={5}>No data available</Title>
            <Paragraph type="secondary">
              There is no data available...
            </Paragraph>
          </Flex>
      }
    </>
  )
}

export default Error