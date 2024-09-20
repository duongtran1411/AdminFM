import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Dropdown, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

interface DataUserProps {
  data: any[];
  columns: any[];
  onEdit: (id: any) => void;
  onDelete: (user_id: any) => void;
}

const UsersTable = ({ data, columns, onEdit, onDelete }: DataUserProps) => {
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
        onClick: () => onEdit(record.id),
      },
      {
        key: "delete",
        label: <span style={{ color: "red" }}>Delete</span>,
        icon: <DeleteOutlined style={{ color: "red" }} />,
        onClick: () => onDelete(record.id),
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
        dataSource={dataSource}
        pagination={false}
        columns={extendedColumns}
      />
    </div>
  );
};

export default UsersTable;
