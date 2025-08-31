import { User } from "@/types/user.type";
import { TableProps, Tag } from "antd";
import { CrownOutlined, UserOutlined } from "@ant-design/icons";

export const getUserColumns = (): TableProps<User>["columns"] => {
  return [
    {
      title: '',
      dataIndex: 'index',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
      render: (_, record) => {
        switch (record.role.name) {
          case "SUPER_ADMIN":
            return <Tag icon={<CrownOutlined />} color="gold">Super admin</Tag>;
          case "ADMIN":
            return <Tag icon={<UserOutlined />} color="blue">Admin</Tag>;
        }
      }
    },
    // {
    //   title: "Estado",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (_, record) => {
    //     switch (record.status) {
    //       case "ACT":
    //         return <Badge status="success" text="Activo" />;
    //       case "INA":
    //         return <Badge status="error" text="Inactivo" />;
    //     }
    //   }
    // },
    // {
    //   title: "",
    //   key: "actions",
    //   render: (_, record) => <DropdownMenu record={record} actions={userActions} />
    // }
  ];
}