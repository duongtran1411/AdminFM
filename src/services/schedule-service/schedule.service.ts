import { Classroom } from "../../models/classes.model";
import { Shifts } from "../../models/shifts";
import { Teachers } from "../../models/teacher.model";
import axiosInstance from "../../utils/axiosInstance";

// Interface cho dữ liệu lịch học
// Interface for schedule data
export interface ScheduleData {
  id: number;
  date: string;
  class: { id: number; name: string }; // Update with actual data type
  shift: { id: number; name: string; startTime: string; endTime: string }; // Update with actual data type
  teacher: { id: number; name: string }; // Update with actual data type
  module: { module_id: number; module_name: string }; // Update with actual data type
  classroom: { id: number; name: string }; // Update with actual data type
}

export interface CreateScheduleData {
  id: number;
  date: string;
  classId: string | undefined; // Update with actual data type
  shiftId: number; // Update with actual data type
  teacherId: number; // Update with actual data type
  moduleId: number; // Update with actual data type
  classroomId: number; // Update with actual data type
}

// New DTO for auto-generated schedule
export interface AutoGenerateScheduleDto {
  schedules: {
    createScheduleDto: {
      shiftId: number;
      classId: number;
      classroomId: number;
      teacherId: number;
      moduleId: number;
      startDate: string;
    };
    selectedDays: string[];
  }[];
}

class ScheduleService {
  // Lấy danh sách lịch học
  async findAll(): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>("/schedules");
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết một lịch học
  async findOne(id: number): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.get<ScheduleData>(
        `/schedules/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule with id ${id}:`, error);
      throw error;
    }
  }

  // Thêm lịch học mới
  async create(schedule: CreateScheduleData): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.post<ScheduleData>(
        "/schedules",
        schedule,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  async autoGenerateSchedule(
    classId: number,
    schedule: AutoGenerateScheduleDto,
  ): Promise<AutoGenerateScheduleDto> {
    try {
      const response = await axiosInstance.post<AutoGenerateScheduleDto>(
        `/schedules/auto/${classId}`,
        schedule,
      );
      return response.data;
    } catch (error) {
      console.error("Error auto-generating schedule:", error);
      throw error;
    }
  }

  // Cập nhật thông tin lịch học
  async update(
    id: number,
    schedule: Partial<CreateScheduleData>,
  ): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.put<ScheduleData>(
        `/schedules/${id}`,
        schedule,
      );

      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error updating schedule with id ${id}:`, error);
      throw error;
    }
  }

  // Xóa lịch học
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/schedules/${id}`);
    } catch (error) {
      console.error(`Error deleting schedule with id ${id}:`, error);
      throw error;
    }
  }

  // Lấy số lượng lịch học theo ngày trong tháng
  async getScheduleCountByDayInMonth(
    date: string,
  ): Promise<{ day: number; count: number }[]> {
    try {
      const response = await axiosInstance.get<
        { day: number; count: number }[]
      >(`/schedule/count-by-day`, { params: { date } });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching schedule count by day in month for date ${date}:`,
        error,
      );
      throw error;
    }
  }
  async findByClassId(id: string): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>(
        `/schedules/class/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  async getShifts(): Promise<Shifts[]> {
    try {
      const response = await axiosInstance.get<Shifts[]>("/shifts");
      return response.data;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
    }
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      const response = await axiosInstance.get<Classroom[]>("/classroom");
      return response.data;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  }

  async getTeachers(): Promise<Teachers[]> {
    try {
      const response = await axiosInstance.get<Teachers[]>("/teachers");
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  }

  async getModule(): Promise<any[]> {
    try {
      const response = await axiosInstance.get<any[]>("/module");
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
