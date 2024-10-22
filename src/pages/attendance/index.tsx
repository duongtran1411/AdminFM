import {
  Button,
  Checkbox,
  Input,
  Layout,
  notification,
  Table,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../../components/common/loading";
import { Attendance } from "../../models/attendance.model";
import {
  getAttendanceStatus,
  markMultipleAttendance,
} from "../../services/attendence-service/attendence.service";

const AttendancePage = () => {
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { scheduleId } = useParams();

  const fetchAttendanceStatus = async (scheduleId: string) => {
    try {
      setLoading(true);
      const data = await getAttendanceStatus(scheduleId);
      setAttendanceData(data);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái điểm danh", error);
      setError("Failed to load attendance status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus(scheduleId!);
  }, [scheduleId]);

  const handleCheckboxChange = (studentId: number, statusType: number) => {
    const updatedAttendanceData = attendanceData.map((attendance) => {
      if (attendance.student.id === studentId) {
        let newStatus;

        if (attendance.status === statusType) {
          newStatus = 0;
        } else {
          newStatus = statusType;
        }

        return {
          ...attendance,
          status: newStatus,
        };
      }
      return attendance;
    });

    setAttendanceData(updatedAttendanceData);
  };

  const handleNoteChange = (studentId: number, newNote: string) => {
    const updatedAttendanceData = attendanceData.map((attendance) => {
      if (attendance.student.id === studentId) {
        return { ...attendance, note: newNote };
      }
      return attendance;
    });
    setAttendanceData(updatedAttendanceData);
  };

  const handleSubmit = async () => {
    // Hiển thị modal xác nhận
    Modal.confirm({
      title: "Xác nhận lưu điểm danh",
      content: "Bạn có chắc chắn muốn lưu trạng thái điểm danh này?",
      onOk: async () => {
        if (!attendanceData) return;

        setLoading(true); // Bắt đầu loading

        try {
          const attendanceDataToSubmit = attendanceData.map((attendance) => ({
            status: attendance.status,
            note: attendance.note,
            teacherId: attendance.teacher.id,
            classId: attendance.class.id,
            scheduleId: Number(scheduleId),
            studentId: attendance.student.id,
          }));
          await markMultipleAttendance(attendanceDataToSubmit);
          notification.success({
            message: "Điểm danh thành công!",
          });
        } catch (error) {
          notification.error({ message: "Lỗi trạng thái khi điểm danh!" });
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log("Đã hủy lưu điểm danh.");
      },
    });
  };

  const markAllAsPresent = () => {
    const areAllPresent = attendanceData.every(
      (attendance) => attendance.status === 1,
    );

    const updatedAttendanceData = attendanceData.map((attendance) => ({
      ...attendance,
      status: areAllPresent ? 0 : 1,
    }));

    setAttendanceData(updatedAttendanceData);
  };

  const columns = [
    {
      title: "Mã Sinh Viên",
      dataIndex: ["student", "studentId"],
      key: "studentId",
    },
    {
      title: "Tên",
      dataIndex: ["student", "name"],
      key: "name",
    },
    {
      title: "Đi học",
      dataIndex: "status",
      key: "diHoc",
      render: (status: number, record: any) => (
        <Checkbox
          checked={status === 1}
          onChange={() => {
            handleCheckboxChange(record.student.id, 1);
          }}
        />
      ),
    },
    {
      title: "Đi muộn",
      dataIndex: "status",
      key: "diMuon",
      render: (status: number, record: any) => (
        <Checkbox
          checked={status === 2}
          onChange={() => {
            handleCheckboxChange(record.student.id, 2);
          }}
        />
      ),
    },
    {
      title: "Nghỉ CP",
      dataIndex: "status",
      key: "nghiCP",
      render: (status: number, record: any) => (
        <Checkbox
          checked={status === 3}
          onChange={() => {
            handleCheckboxChange(record.student.id, 3);
          }}
        />
      ),
    },
    {
      title: "Nghỉ KP",
      dataIndex: "status",
      key: "nghiKP",
      render: (status: number, record: any) => (
        <Checkbox
          checked={status === 4}
          onChange={() => {
            handleCheckboxChange(record.student.id, 4);
          }}
        />
      ),
    },
    {
      title: "Ghi Chú",
      dataIndex: "note",
      key: "note",
      render: (note: string, record: any) => (
        <Input
          value={note}
          onChange={(e) => handleNoteChange(record.student.id, e.target.value)}
        />
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout
      className="rounded-lg flex justify-center items-center"
      style={{
        background: "white",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-6xl">
        <Table
          columns={columns}
          dataSource={attendanceData}
          pagination={false}
        />
        <div className="flex justify-end mt-4">
          <Button
            type="default"
            onClick={markAllAsPresent}
            style={{ marginRight: 8 }}
          >
            Điểm danh tất cả
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;
