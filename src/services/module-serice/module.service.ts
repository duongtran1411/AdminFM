import { CreateModule, ExamType, Module } from "../../models/courses.model";
import { Response } from "../../models/response.model";
import axiosInstance from "../../utils/axiosInstance";

class ModuleService {
  async getAllModules(): Promise<Response<Module[]>> {
    try {
      const response = await axiosInstance.get<Response<Module[]>>("/module");
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }

  async getAllExamTypes(): Promise<Response<ExamType[]>> {
    try {
      const response = await axiosInstance.get<Response<ExamType[]>>(
        "/examtypes",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching exam types:", error);
      throw error;
    }
  }

  async getModuleById(id: number): Promise<Response<Module>> {
    try {
      const response = await axiosInstance.get<Response<Module>>(
        `/module/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<Response<void>> {
    try {
      const response = await axiosInstance.delete<Response<void>>(
        `/module/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  }

  async add(module: CreateModule): Promise<Response<Module>> {
    try {
      const response = await axiosInstance.post<Response<Module>>(
        "/module",
        module,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching module:", error);
      throw error;
    }
  }

  async update(id: number, module: any): Promise<Response<Module>> {
    try {
      const response = await axiosInstance.patch<Response<Module>>(
        `/module/${id}`,
        module,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  }

  async getModulesByClassAndTerm(
    classId: number,
    termNumber: number,
  ): Promise<Response<Module[]>> {
    try {
      const response = await axiosInstance.get<Response<Module[]>>(
        `/module/class/${classId}/term/${termNumber}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching modules by class and term:", error);
      throw error;
    }
  }

  async getModulesByCode(code: string): Promise<Response<Module>> {
    try {
      const response = await axiosInstance.get<Response<Module>>(
        `/module/code/${code}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching modules by code:", error);
      throw error;
    }
  }
}
export const moduleService = new ModuleService();
