import { Module } from "../../models/courses.model";
import axiosInstance from "../../utils/axiosInstance";

class ModuleService {
  async getAllModules(): Promise<Module[]> {
    try {
      const response = await axiosInstance.get<Module[]>("/module");
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/module/${id}`);
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  }
  async add(module: Module): Promise<Module[]> {
    try {
      const response = await axiosInstance.post<Module[]>("/module", module);
      return response.data;
    } catch (error) {
      console.error("Error fetching module:", error);
      throw error;
    }
  }
  async update(id: string, module: any): Promise<void> {
    try {
      await axiosInstance.patch(`/module/${id}`, module);
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  }
}
export const moduleService = new ModuleService();
