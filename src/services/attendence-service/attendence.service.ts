// attendence.service.ts
import axiosInstance from "../../utils/axiosInstance";

// Định nghĩa interface cho dữ liệu điểm danh
export interface AttendanceStatus {
  id: number;
  studentId: string;
  isChecked: boolean;
  studentName: string;
}

// Service để lấy trạng thái điểm danh theo lịch
export const getAttendanceStatus = async (
  scheduleId: string,
): Promise<AttendanceStatus[]> => {
  try {
    // Gửi yêu cầu GET đến API để lấy trạng thái điểm danh theo scheduleId
    const response = await axiosInstance.get<AttendanceStatus[]>(
      `attendance/schedule/${scheduleId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Chuyển đổi dữ liệu thành dạng { studentId: true/false }
    //  const attendanceMap = response.data.reduce((acc: Record<number, boolean>, attendance: AttendanceStatus) => {
    //    acc[attendance.studentId] = attendance.status === 1;
    //    return acc;
    //  }, {});
    //  console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    throw error;
  }
};
