import { EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

interface DataTableProps {
  data: any[];
  columns: any[];
  onView: (id: any) => void;
}

const FreshmenTable = ({ data, columns, onView }: DataTableProps) => {
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
        key: "view",
        label: <span>View</span>,
        icon: <EyeOutlined />,
        onClick: () => onView(record.id),
      },
    ],
  });

  const extendedColumns = [
    ...columns,
    {
      title: "Action",
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
        columns={extendedColumns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
};

export default FreshmenTable;
