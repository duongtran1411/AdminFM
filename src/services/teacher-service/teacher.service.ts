import { Teachers } from "../../models/teacher.model";
import axiosInstance from "../../utils/axiosInstance";

class TeacherService {
  // Lấy danh sách giáo viên
  async findAll(): Promise<Teachers[]> {
    try {
      const response = await axiosInstance.get<Teachers[]>("/teachers");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết một giáo viên
  async findOne(id: number): Promise<Teachers> {
    try {
      const response = await axiosInstance.get<Teachers>(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher with id ${id}:`, error);
      throw error;
    }
  }

  // Thêm giáo viên mới
  async create(teacher: Teachers): Promise<Teachers> {
    try {
      const response = await axiosInstance.post<Teachers>("/teachers", teacher);
      return response.data;
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  }

  // Cập nhật thông tin giáo viên
  async update(id: number, teacher: Partial<Teachers>): Promise<Teachers> {
    try {
      const response = await axiosInstance.patch<Teachers>(
        `/teachers/${id}`,
        teacher,
      );

      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error updating teacher with id ${id}:`, error);
      throw error;
    }
  }

  // Xóa giáo viên
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/teachers/${id}`);
    } catch (error) {
      console.error(`Error deleting teacher with id ${id}:`, error);
      throw error;
    }
  }
}

export const teacherService = new TeacherService();
