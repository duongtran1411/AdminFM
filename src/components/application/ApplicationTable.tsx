import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

interface DataApplicationProps {
  data: any[];
  columns: any[];
  // onView: (id: any) => void;
  onEdit: (id: any) => void;
  onDownload: (id: any) => void;
}

const ApplicationTable = ({
  data,
  columns,
  // onView,
  onEdit,
  onDownload,
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

  const actionMenu = (record) => ({
    items: [
      // {
      //   key: "view",
      //   label: <span>View</span>,
      //   icon: <EyeOutlined />,
      //   onClick: () => onView(record.id),
      // },
      {
        key: "edit",
        label: <span>Edit</span>,
        icon: <EditOutlined />,
        onClick: () => onEdit(record.id),
      },
      {
        key: "download",
        label: <span>Download</span>,
        icon: <DownloadOutlined />,
        onClick: () => onDownload(record.id),
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
        dataSource={dataSource}
        pagination={false}
        columns={extendedColumns.map((col) => ({
          ...col,

          className: "border border-gray-300",
        }))}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        }
      />
    </div>
  );
};

export default ApplicationTable;
