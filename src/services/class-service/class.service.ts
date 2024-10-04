// services/class/class.service.ts
import { Class } from "../../models/classes.model";
import { Module } from "../../models/courses.model";
import axiosInstance from "../../utils/axiosInstance";

export interface ClassData {
  data: { id: number; title: string; position: string; totalStudent: number };
}

export interface ClassResponse {
  statusCode: number;
  message: string;
  data: ClassData[];
}

class ClassService {
  async getModulesByCoursesFamilyOfClass(classId: number): Promise<Module[]> {
    try {
      const response = await axiosInstance.get<Module[]>(
        `/classes/modules/${classId}`,
      );
      console.log(response.data);
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

  async getClassById(classId: number): Promise<ClassData> {
    try {
      const response = await axiosInstance.get<ClassData>(
        `/classes/${classId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async addClass(classData: Class): Promise<Class[]> {
    try {
      const response = await axiosInstance.post<Class[]>("/classes", classData);
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async updateClass(classId: number, classData: any): Promise<void> {
    try {
      await axiosInstance.put(`/classes/${classId}`, classData);
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
