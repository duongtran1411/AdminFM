import { IntensiveCare } from "../../models/intensive.care.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class IntensiveCareService {
  async getAll(): Promise<Response<IntensiveCare[]>> {
    try {
      const response = await axiosInstance.get<Response<IntensiveCare[]>>(
        "/intensive-care",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      throw error;
    }
  }
}

export default new IntensiveCareService();
