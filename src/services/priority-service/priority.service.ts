import { Priority } from "../../models/priority.model";
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
}

export default new PriorityService();
