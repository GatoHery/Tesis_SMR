import GenericTable from "@/components/GenericTable";
import { getUserColumns } from "./Columns";
import useUserStore from "@/store/user.store";

const UsersTable = () => {
  const { users, loading } = useUserStore();

  return (
    <GenericTable
      columns={getUserColumns()}
      dataSource={users}
      rowKey={(record) => record.email}
      loading={loading}
    />
  )
}

export default UsersTable