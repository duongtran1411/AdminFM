import { Shifts } from "../../models/shifts";
import axiosInstance from "../../utils/axiosInstance";

class ShiftsService {
  // Lấy danh sách lịch học
  async findAll(): Promise<Shifts[]> {
    try {
      const response = await axiosInstance.get<Shifts[]>("/shifts");
      return response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }
}
export const shiftsService = new ShiftsService();
