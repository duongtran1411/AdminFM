import { Module } from "../../models/courses.model";
import axiosInstance from "../../utils/axiosInstance";

class ModuleService {
  // Lấy tất cả các modules
  async getAllModules(): Promise<Module[]> {
    try {
      const response = await axiosInstance.get<Module[]>("/module");
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }
}
export const moduleService = new ModuleService();
