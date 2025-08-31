import { Table, TableProps } from "antd"

type GenericTableProps<T> = {
  columns: TableProps<T>["columns"];
  dataSource: T[];
  loading?: boolean;
  pagination?: TableProps<T>["pagination"];
  rowKey?: (record: T) => string;
}

const GenericTable = <T extends object>({
  columns,
  dataSource,
  loading = false,
  rowKey,
  pagination
}: GenericTableProps<T>) => {
  return (
    <Table<T>
      rowKey={rowKey}
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={pagination}
    />
  );
}

export default GenericTable