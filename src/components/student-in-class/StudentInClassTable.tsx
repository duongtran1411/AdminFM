import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useEffect, useRef, useState } from "react";

interface DataTableProps {
  data: any[];
  columns: any[];
  onEdit: (id: any) => void; // Update to receive studentId
  onDelete: (id: any) => void; // Update to receive studentId
}

const StudentInClassTable = ({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps) => {
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
      title: "View",
      key: "view",
      render: (_) => <div>View</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => onEdit(record.id)}
          />
          <Button
            icon={<DeleteOutlined style={{ color: "red" }} />}
            type="text"
            onClick={() => onDelete(record.id)}
          />
        </div>
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
      <Table
        columns={extendedColumns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
};

export default StudentInClassTable;
