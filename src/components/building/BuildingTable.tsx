import { Table } from "antd";
import { useEffect, useRef, useState } from "react";

interface DataTableProps {
  data: any[];
  columns: any[];
  //   onEdit: (id: any) => void; // Update to receive studentId
  //   onDelete: (studentId: any) => void; // Update to receive studentId
}

const BuildingTable = ({ data, columns }: DataTableProps) => {
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
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default BuildingTable;
