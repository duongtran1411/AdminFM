// attendence.service.ts
import axiosInstance from "../../utils/axiosInstance";

// Define interface for Student
export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  gender: string | null;
  birthdate: string;
  phone: string | null;
}

// Define interface for AttendanceStatus
export interface AttendanceStatus {
  student: Student;
  status: number;
  note: string | null;
}

// Define interface for AttendanceResponse
export interface AttendanceResponse {
  attendances: AttendanceStatus[];
  total: number;
}

// Service to get attendance status by schedule
export const getAttendanceStatus = async (
  scheduleId: string,
): Promise<AttendanceResponse> => {
  try {
    // Send GET request to API to get attendance status by scheduleId
    const response = await axiosInstance.get<AttendanceResponse>(
      `attendance/schedule/${scheduleId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    throw error;
  }
};
