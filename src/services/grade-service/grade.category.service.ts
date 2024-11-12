import { GradeCategory } from "../../models/gradecategory.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class GradecategoryService {
  async getAll(): Promise<Response<GradeCategory[]>> {
    try {
      const response = await axiosInstance.get<Response<GradeCategory[]>>(
        "/gradecategory",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching grade category:", error);
      throw error;
    }
  }
}

export default new GradecategoryService();
