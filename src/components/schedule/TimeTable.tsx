import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ScheduleData } from "../../models/schedules.model";

interface TimetableProps {
  scheduleData: ScheduleData[];
  onEdit: (schedule: ScheduleData) => void;
  onDelete: (schedule: ScheduleData) => void;
  selectedDateRange: [Dayjs, Dayjs] | null;
}

const Timetable: React.FC<TimetableProps> = ({
  scheduleData,
  onEdit,
  onDelete,
  selectedDateRange,
}) => {
  const [tableData, setTableData] = useState<(ScheduleData | null)[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<{
    slot: number;
    day: number;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initialTable = Array.from({ length: 8 }, () => Array(7).fill(null));

    scheduleData.forEach((data) => {
      const date = new Date(data.date);
      const dayIndex = (date.getDay() + 6) % 7;
      const slot = parseInt(data.shift.name.replace("Slot ", ""), 10) - 1;

      if (dayIndex >= 0 && dayIndex < 7 && slot >= 0 && slot < 8) {
        initialTable[slot][dayIndex] = data;
      }
    });

    setTableData(initialTable);
  }, [scheduleData]);

  const startOfWeek = selectedDateRange
    ? selectedDateRange[0].startOf("isoWeek")
    : dayjs().startOf("isoWeek");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const columns = [
    { title: "Slot", dataIndex: "slot", key: "slot" },
    ...daysOfWeek.map((day, dayIndex) => {
      const currentDay = startOfWeek.add(dayIndex, "day");
      return {
        title: (
          <div>
            <div>{day}</div>
            <div style={{ fontSize: "0.8em", color: "gray" }}>
              {currentDay.format("DD-MM-YYYY")}
            </div>
          </div>
        ),
        dataIndex: `day${dayIndex}`,
        key: `day${dayIndex}`,
        render: (data: ScheduleData | null, record: any) =>
          data ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor:
                  hoveredCell?.slot === record.key &&
                  hoveredCell?.day === dayIndex
                    ? "#e6f7ff"
                    : "transparent",
                borderRadius: "4px",
                padding: "5px",
              }}
              onMouseEnter={() =>
                setHoveredCell({ slot: record.key, day: dayIndex })
              }
              onMouseLeave={() => setHoveredCell(null)}
            >
              <div
                onClick={() => navigate(`/schedule/attendance/${data.id}`)}
                style={{ flex: 1 }}
              >
                <Tag color="cyan" style={{ fontWeight: "500" }}>
                  {data.module.module_name}
                </Tag>
                <Link
                  to={`/material/${data.id}`}
                  style={{
                    color: "#1890ff",
                    fontWeight: "500",
                    textDecoration: "underline",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Material
                </Link>

                <p>{`at ${data.classroom.name}`}</p>
                <p>{`(${formatTime(data.shift.startTime)} - ${formatTime(
                  data.shift.endTime,
                )})`}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(data);
                  }}
                />
                <Button
                  icon={<DeleteOutlined style={{ color: "red" }} />}
                  type="link"
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(data);
                  }}
                />
              </div>
            </div>
          ) : (
            "-"
          ),
      };
    }),
  ];

  const dataSource = tableData.map((slots, index) => {
    const dayData: Record<string, ScheduleData | null> = {};

    slots.forEach((data, dayIndex) => {
      dayData[`day${dayIndex}`] = data;
    });

    return {
      key: `slot-${index}`,
      slot: `Slot ${index + 1}`,
      ...dayData,
    };
  });

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      rowKey="key"
    />
  );
};

// Helper function to format time
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

export default Timetable;
