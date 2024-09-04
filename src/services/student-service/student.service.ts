import { AxiosResponse } from "axios";
import { StudentList } from "../../models/student.model"; // Assuming you have a StudentList type/model defined
import axiosInstance from "../../utils/axiosInstance";

class StudentService {
  // Tạo một student mới
  async create(studentList: StudentList): Promise<StudentList> {
    try {
      const response: AxiosResponse<StudentList> = await axiosInstance.post(
        "/student-list",
        studentList,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error creating student: " + error.message);
    }
  }

  async findAll(classId?: string): Promise<StudentList[]> {
    try {
      const response: AxiosResponse<StudentList[]> = await axiosInstance.get(
        `/student-list/class/${classId}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching students: " + error.message);
    }
  }

  // Lấy một student theo ID
  async findOne(id: number): Promise<StudentList> {
    try {
      const response: AxiosResponse<StudentList> = await axiosInstance.get(
        `/student-list/${id}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching student: " + error.message);
    }
  }

  // Cập nhật một student theo ID
  async update(id: number, studentList: StudentList): Promise<StudentList> {
    try {
      const response: AxiosResponse<StudentList> = await axiosInstance.patch(
        `/student-list/${id}`,
        studentList,
      );
      console.log(response);
      return response.data;
    } catch (error: any) {
      throw new Error("Error updating student: " + error.message);
    }
  }

  // Xóa một student theo ID
  async remove(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/student-list/${id}`);
      console.log("Delete : " + id);
    } catch (error: any) {
      throw new Error("Error deleting student: " + error.message);
    }
  }
}

export const studentService = new StudentService();
