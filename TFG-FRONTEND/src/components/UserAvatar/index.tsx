import { Avatar, Button, Flex, Typography } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import useAuthStore from "@/store/auth.store";

type UserAvatarProps = {
  collapsed: boolean;
}

const UserAvatar = ({ collapsed }: UserAvatarProps) => {
  const { user, logout } = useAuthStore();

  return (
    <Flex vertical={collapsed} gap={3} justify="space-between" align="center" style={{ padding: '16px' }}>
      <Flex gap={10} align="center">
        {!collapsed && (
          <>
            <Avatar size="large" icon={<UserOutlined />} />
            <div>
              <Typography.Text strong>{user?.name}</Typography.Text>
              <br />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>{user?.email}</Typography.Text>
            </div>
          </>
        )}
      </Flex>
      <Button
        type="text"
        variant="solid"
        size="large"
        danger
        icon={<LogoutOutlined />}
        onClick={logout}
      />
    </Flex>
  )
}

export default UserAvatar