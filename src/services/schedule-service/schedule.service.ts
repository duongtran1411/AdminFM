import axiosInstance from "../../utils/axiosInstance";

// Interface cho dữ liệu lịch học
// Interface for schedule data
export interface ScheduleData {
  id: number;
  date: string;
  class: { id: number; name: string }; // Update with actual data type
  shift: { id: number; name: string; startTime: string; endTime: string }; // Update with actual data type
  lecturer: { id: number; name: string }; // Update with actual data type
  subject: { id: number; name: string }; // Update with actual data type
  classroom: { id: number; name: string }; // Update with actual data type
}

export interface CreateScheduleData {
  id: number;
  date: string;
  class: string | undefined; // Update with actual data type
  shift: number; // Update with actual data type
  lecturer: number; // Update with actual data type
  subject: number; // Update with actual data type
  classroom: number; // Update with actual data type
}

class ScheduleService {
  // Lấy danh sách lịch học
  async findAll(): Promise<ScheduleData[]> {
    try {
      const response = await axiosInstance.get<ScheduleData[]>("/schedule");
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết một lịch học
  async findOne(id: number): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.get<ScheduleData>(`/schedule/${id}`);
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
        "/schedule",
        schedule,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  // Cập nhật thông tin lịch học
  async update(
    id: number,
    schedule: Partial<ScheduleData>,
  ): Promise<ScheduleData> {
    try {
      const response = await axiosInstance.patch<ScheduleData>(
        `/schedule/${id}`,
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
      await axiosInstance.delete(`/schedule/${id}`);
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

  async getShifts(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axiosInstance.get<{ id: number; name: string }[]>(
        "/shift",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
    }
  }

  async getClassrooms(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axiosInstance.get<{ id: number; name: string }[]>(
        "/classroom",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  }

  async getLecturers(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axiosInstance.get<{ id: number; name: string }[]>(
        "/lecturer",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      throw error;
    }
  }

  async getSubjects(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await axiosInstance.get<{ id: number; name: string }[]>(
        "/subjects",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
