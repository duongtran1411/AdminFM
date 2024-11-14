import { Priority, CreatePriorityDto } from "../../models/priority.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class PriorityService {
  async getAll(): Promise<Response<Priority[]>> {
    try {
      const response = await axiosInstance.get<Response<Priority[]>>(
        "/priority",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      throw error;
    }
  }

  async add(priority: CreatePriorityDto): Promise<Response<Priority>> {
    try {
      const response = await axiosInstance.post<Response<Priority>>(
        "/priority",
        priority,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching priority:", error);
      throw error;
    }
  }

  async update(id: number, priorityData: any): Promise<Response<Priority>> {
    try {
      const response = await axiosInstance.put<Response<Priority>>(
        `/priority/${id}`,
        priorityData,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating priority:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<Response<void>> {
    try {
      const response = await axiosInstance.delete<Response<void>>(
        `/priority/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting priority:", error);
      throw error;
    }
  }
}

export default new PriorityService();
