import { Table } from "antd";
import { useEffect, useRef, useState } from "react";

interface DataApplicationProps {
  data: any[];
  columns: any[];
}

const ApplicationTable = ({ data, columns }: DataApplicationProps) => {
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
        columns={columns.map((col) => ({
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
