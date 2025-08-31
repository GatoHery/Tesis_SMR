// ** Third-party Imports
import { Card, Flex, Statistic, theme, Typography } from "antd"
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"

// ** Zustand Store Imports
import useThemeStore from "@/store/theme.store";

type DataCardProps = {
  title: string;
  value: number;
  precision?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  description: string;
  descriptionSuffix?: string;
  change: number;
  icon: React.ReactNode;
  loading?: boolean;
}

const DataCard = ({ title, value, precision, valuePrefix, valueSuffix, change, icon, description, descriptionSuffix, loading = false }: DataCardProps) => {
  const { token } = theme.useToken()
  const { darkMode } = useThemeStore();

  const { Text } = Typography;

  return (

    <Card variant="borderless" style={{ background: token.colorBgContainer, height: "auto", minHeight: "130.49px" }} loading={loading}>
      <Flex vertical>
        <Flex justify="space-between" align="center">
          <div>
            <Text style={{ fontSize: 14.5 }}>{title}</Text>
            <Statistic
              value={value}
              prefix={valuePrefix}
              suffix={valueSuffix}
              precision={precision}
              valueStyle={{ fontSize: 24, fontWeight: 600 }}
            />
          </div>

          <div
            style={{
              backgroundColor: darkMode ? '#545665' : '#f6f6f6',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {icon}

          </div>
        </Flex>

        {change !== 0 ? (
          <Flex align="center">
            {
              change > 0 ?
                <IoMdArrowDropup style={{ color: token.colorSuccess }} size={20} />
                :
                <IoMdArrowDropdown style={{ color: token.colorError }} size={20} />
            }
            <Text style={{ color: change > 0 ? token.colorSuccess : token.colorError }}>
              {change > 0 && '+'}{change} {descriptionSuffix}&nbsp;
              <Text type="secondary">{description}</Text>
            </Text>
          </Flex>
        )
          :
          <Text type="secondary">Sin variación semanal</Text>
        }

      </Flex>

    </Card>
  )
}

export default DataCard