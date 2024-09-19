import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

interface DataTableProps {
  data: any[];
  columns: any[];
  onEdit: (id: any) => void;
  onDelete: (teacher_id: any) => void;
}

const TeacherTable = ({ data, columns, onEdit, onDelete }: DataTableProps) => {
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

  const actionMenu = (record) => ({
    items: [
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => onEdit(record.teacher_id),
      },
      {
        key: "delete",
        label: <span style={{ color: "red" }}>Delete</span>,
        icon: <DeleteOutlined style={{ color: "red" }} />,
        onClick: () => onDelete(record.teacher_id),
      },
    ],
  });

  const extendedColumns = [
    ...columns,
    {
      title: "",
      key: "action",
      render: (record) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]}>
          <Button icon={<CiMenuKebab />} type="text" />
        </Dropdown>
      ),
    },
  ];

  // Ensure each item has a unique key
  const dataSource = data.map((item) => ({
    ...item,
    key: item.id, // Use a unique identifier from your data
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

export default TeacherTable;
