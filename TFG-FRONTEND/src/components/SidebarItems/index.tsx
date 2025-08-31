// ** Third Party Imports
import { Menu, MenuProps } from "antd"
import { useNavigate } from "react-router";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { AiOutlineCalendar, AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import useAuthStore from "@/store/auth.store";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type SidebarItemsProps = {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarItems = ({ setOpen }: SidebarItemsProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleMenuClick = ({ key }: { key: React.Key }) => {
    navigate(`${key}`);

    if (setOpen) setOpen(false);
  };

  const rawItems = [
    { label: 'Dashboard', key: '/', icon: <AiOutlineDashboard size={18} />, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { label: 'Monitor', key: '/monitor', icon: <MdOutlineMonitorHeart size={18} />, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { label: 'Reservas', key: '/reservations', icon: <AiOutlineCalendar size={18} />, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { label: 'Usuarios', key: '/users', icon: <AiOutlineUser size={18} />, roles: ['SUPER_ADMIN'] },
  ];

  const filteredItems = rawItems
    .filter(item => item.roles.includes(user?.role || ''))
    .map(item => getItem(item.label, item.key, item.icon));

  return (
    <Menu
      style={{ border: 'none', margin: 0 }}
      defaultSelectedKeys={['/']}
      selectedKeys={[window.location.pathname]}
      mode="inline"
      items={filteredItems}
      onClick={handleMenuClick}
    />
  )
}

export default SidebarItems
