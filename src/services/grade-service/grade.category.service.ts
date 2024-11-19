import { GradeCategory, GradeData } from "../../models/gradecategory.model";
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

  async getGradeByModuleAndStudent(
    studentId: number,
    moduleId: number,
  ): Promise<Response<GradeData[]>> {
    const response = await axiosInstance.get(
      `/gradecategory/student/${studentId}/module/${moduleId}`,
    );
    return response.data;
  }
}

export const gradeCategoryService = new GradecategoryService();
