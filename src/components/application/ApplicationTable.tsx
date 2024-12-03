import { EditOutlined } from "@ant-design/icons";
import { Button, Table, Spin } from "antd";
import { useEffect, useRef, useState } from "react";

interface DataApplicationProps {
  data: any[];
  columns: any[];
  onEdit: (id: any) => void;
  loading: boolean;
}

const ApplicationTable = ({
  data,
  columns,
  onEdit,
  loading,
}: DataApplicationProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current) {
        const isScrollable =
          tableRef.current.scrollWidth > tableRef.current.clientWidth;
        setCanScroll(isScrollable);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const extendedColumns = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          type="text"
          onClick={() => onEdit(record.id)}
        />
      ),
    },
  ];

  const dataSource = data.map((item) => ({
    ...item,
    key: item.id,
  }));

  return (
    <div
      ref={tableRef}
      className={`${
        canScroll ? "scrollbar-thin" : "scrollbar-none"
      } overflow-x-auto`}
    >
      <Spin spinning={loading}>
        <Table
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
          columns={extendedColumns.map((col) => ({
            ...col,
            className: "border border-gray-300",
          }))}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-100"
          }
        />
      </Spin>
    </div>
  );
};

export default ApplicationTable;
