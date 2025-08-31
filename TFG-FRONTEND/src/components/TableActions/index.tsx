import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

export type DropdownAction<T> = {
  key: string;
  label: string;
  onClick: (record: T) => void;
};

type DropdownMenuProps<T> = {
  record: T;
  actions: DropdownAction<T>[];
};

const DropdownMenu = <T,>({ record, actions }: DropdownMenuProps<T>) => {
  const menuItems = actions.map(({ label, key, onClick }) => ({
    label: <a onClick={() => onClick(record)}>{label}</a>,
    key,
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
    >
      <Button
        type="text"
        shape="circle"
        icon={<MoreOutlined style={{ fontSize: "20px" }} />}
      />
    </Dropdown>
  );
};

export default DropdownMenu;
