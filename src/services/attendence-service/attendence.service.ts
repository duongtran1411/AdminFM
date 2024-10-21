// attendence.service.ts

import { Attendance } from "../../models/attendance.model";
import axiosInstance from "../../utils/axiosInstance";

export const getAttendanceStatus = async (
  scheduleId: string,
): Promise<Attendance[]> => {
  try {
    const response = await axiosInstance.get<Attendance[]>(
      `attendance/schedule/${scheduleId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    throw error;
  }
};


export const markMultipleAttendance = async (
  attendanceStatuses: any[],
): Promise<any[]> => {
  try {
    const response = await axiosInstance.post<any[]>(
      `attendance/mark/multiple`,
      attendanceStatuses,
    );
    return response.data;
  } catch (error) {
    console.error("Error marking multiple attendance:", error);
    throw error;
  }
};
