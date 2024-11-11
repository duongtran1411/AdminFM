import { Class } from "../../models/classes.model";
import { Module } from "../../models/courses.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

// export interface ClassData {
//   data: { id: number; title: string; position: string; totalStudent: number };
// }

export interface ClassResponse {
  statusCode: number;
  message: string;
  data: Class[];
}

class ClassService {
  async getModulesByCoursesFamilyOfClass(classId: number): Promise<Module[]> {
    try {
      const response = await axiosInstance.get<Module[]>(
        `/classes/modules/${classId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async getClasses(): Promise<ClassResponse> {
    try {
      const response = await axiosInstance.get<ClassResponse>("/classes");
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async getClassById(classId: number): Promise<Response<Class>> {
    try {
      const response = await axiosInstance.get<Response<Class>>(
        `/classes/${classId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async addClass(
    classData: Response<ClassResponse>,
  ): Promise<Response<ClassResponse>> {
    const response = await axiosInstance.post<Response<ClassResponse>>(
      "/classes",
      classData,
    );
    if (response.data.data === null) {
      throw new Error(response.data.message);
    }
    return response.data;
  }

  async updateClass(classId: number, classData: any): Promise<void> {
    try {
      await axiosInstance.patch(`/classes/${classId}`, classData);
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  }

  async deleteClass(classId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/classes/${classId}`);
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }
}

export default new ClassService();
