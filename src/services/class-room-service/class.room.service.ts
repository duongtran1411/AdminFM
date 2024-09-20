import { AxiosResponse } from "axios";
import { Classroom } from "../../models/class.model";
import axiosInstance from "../../utils/axiosInstance";

class ClassService {
  async getClassrooms(): Promise<Classroom[]> {
    try {
      const response = await axiosInstance.get<Classroom[]>("/classroom");
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async add(classroom: Classroom): Promise<Classroom[]> {
    try {
      const response = await axiosInstance.post<Classroom[]>(
        "/classroom",
        classroom,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  async update(id: number, classroom: any): Promise<void> {
    try {
      await axiosInstance.patch(`/classroom/${id}`, classroom);
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/classroom/${id}`);
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }

  async getClassroomsByBId(buildingId: number): Promise<Classroom[]> {
    try {
      const response: AxiosResponse<Classroom[]> = await axiosInstance.get(
        `classroom/building/${buildingId}/classrooms`,
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classrooms by building ID:", error);
      throw new Error("Error fetching classrooms: " + error.message);
    }
  }
}

export default new ClassService();
