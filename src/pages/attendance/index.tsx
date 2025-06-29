import {
  Button,
  Checkbox,
  Input,
  Layout,
  Modal,
  notification,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/common/loading";
import NavigateBack from "../../components/shared/NavigateBack";
import { Attendance } from "../../models/attendance.model";
import { Class } from "../../models/classes.model";
import { Teachers } from "../../models/teacher.model";
import {
  getAttendanceStatus,
  markMultipleAttendance,
} from "../../services/attendence-service/attendence.service";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { scheduleId } = useParams();
  const [teacher, setTeacher] = useState<Teachers | null>(null);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [scheduleIdState, setScheduleIdState] = useState<number | null>(null);

  const fetchAttendanceStatus = async (scheduleId: string) => {
    try {
      setLoading(true);
      const data = await getAttendanceStatus(scheduleId);

      let attendanceArray: any[] = [];
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        data.data &&
        typeof (data as any).data === "object" &&
        Array.isArray((data as any).data.students)
      ) {
        const d = (data as any).data;
        attendanceArray = d.students;
        setTeacher(d.teacher || null);
        setClassInfo(d.class || null);
        setScheduleIdState(Number(d.scheduleId) || null);
      }

      if (Array.isArray(attendanceArray)) {
        setAttendanceData(attendanceArray);
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy trạng thái điểm danh", error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scheduleId) {
      fetchAttendanceStatus(scheduleId);
    } else {
      setLoading(false);
    }
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
    Modal.confirm({
      title: "Xác nhận lưu điểm danh",
      content: "Bạn có chắc chắn muốn lưu trạng thái điểm danh này?",
      onOk: async () => {
        if (!attendanceData || !teacher || !classInfo || !scheduleIdState)
          return;
        setLoading(true);
        try {
          const attendanceDataToSubmit = attendanceData.map((attendance) => ({
            status: attendance.status,
            note: attendance.note,
            teacherId: teacher.id,
            classId: classInfo.id,
            scheduleId: scheduleIdState,
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
      onCancel() {},
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
      render: (studentId: number | null) => (studentId ? studentId : "N/A"),
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
      title: "Vắng mặt",
      dataIndex: "status",
      key: "nghiKP",
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

  return (
    <Layout
      className="rounded-lg flex justify-center items-center"
      style={{
        background: "white",
        padding: "20px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div className="w-full max-w-6xl">
        <NavigateBack />
        <Table
          columns={columns}
          dataSource={attendanceData}
          pagination={false}
          locale={{
            emptyText:
              attendanceData.length === 0 && !loading
                ? "Không có dữ liệu điểm danh"
                : "Đang tải...",
          }}
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
