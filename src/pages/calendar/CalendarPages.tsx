import React, { useState, useEffect } from 'react';
import { Calendar, Spin, Alert, Table, QRCode } from 'antd';
import 'antd/dist/reset.css';
import { Link } from 'react-router-dom';
import ClassService, { ClassData } from "../../services/class-service/class.service";

const CalendarPages = () => {
  const [dailyClasses, setDailyClasses] = useState<ClassData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const columns = [
    {
      title: "Tên Lớp",
      dataIndex: "name",
      key: "className",
      render: (className: string) => (
        <Link to={`/`}>{className}</Link>
      ),
    }
  ];

  // Lấy ngày hôm nay và fetch dữ liệu lớp học ban đầu
  useEffect(() => {
    const fetchTodayClasses = async () => {
      const today = new Date();
      const todayString = today.toISOString().slice(0, 10); // Format today's date as "YYYY-MM-DD"
      setSelectedDate(todayString);

      try {
        const data = await ClassService.getClassBySchedule(todayString);
        setDailyClasses(data);
      } catch (error) {
        console.error("Error loading classes for today:", error);
      }
    };

    fetchTodayClasses();
  }, []);

  const onDateSelect = async (date: any) => {
    const dateString = date.format('YYYY-MM-DD');
    setSelectedDate(dateString);

    try {
      const data = await ClassService.getClassBySchedule(dateString);
      setDailyClasses(data);
    } catch (error) {
      console.error("Error loading classes for selected date:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Calendar Page</h2>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {/* Không reset Calendar, chỉ gọi onDateSelect khi chọn ngày */}
          <Calendar onSelect={onDateSelect} style={{ width: '100%' }} />
        </div>

        {/* Không reset giao diện bảng */}
        <div style={{ flex: 2, marginLeft: '20px' }}>
          {selectedDate && (
            <div>
              <h3>Classes on {selectedDate}</h3>
              <>
                {dailyClasses.length > 0 ? (
                  <Table pagination={false} columns={columns} dataSource={dailyClasses} rowKey="id" />

                ) : (
                  <strong><p>No classes on this date</p></strong>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPages;
