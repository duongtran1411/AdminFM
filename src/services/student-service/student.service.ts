import { AxiosResponse } from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { Freshmen, Student } from "../../models/student.model";
import { Response } from "../../models/response.model";

class StudentService {
  async create(studentList: Student): Promise<Response<Student>> {
    try {
      const response: AxiosResponse<Response<Student>> =
        await axiosInstance.post("/students", studentList);
      return response.data;
    } catch (error: any) {
      throw new Error("Error creating student: " + error.message);
    }
  }

  async findAll(classId?: string): Promise<Response<Student[]>> {
    try {
      const response: AxiosResponse<Response<Student[]>> =
        await axiosInstance.get(`/students/class/${classId}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching students: " + error.message);
    }
  }

  async findStudentsWithoutClass(): Promise<Response<Freshmen[]>> {
    try {
      const response: AxiosResponse<Response<Freshmen[]>> =
        await axiosInstance.get("/students/without-class");
      return response.data;
    } catch (error: any) {
      throw new Error(
        "Error fetching students without class: " + error.message,
      );
    }
  }

  // Cập nhật một student theo ID
  async update(id: number, studentList: Student): Promise<Response<Student>> {
    try {
      const response: AxiosResponse<Response<Student>> =
        await axiosInstance.put(`/students/${id}`, studentList);
      return response.data;
    } catch (error: any) {
      throw new Error("Error updating student: " + error.message);
    }
  }

  // Xóa một student theo ID
  async remove(id: number): Promise<Response<void>> {
    try {
      const response: AxiosResponse<Response<void>> =
        await axiosInstance.delete(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Error deleting student: " + error.message);
    }
  }

  async createStudentWithClass(
    classId: number,
    studentIds: number[],
  ): Promise<Response<Student[]>> {
    try {
      const response: AxiosResponse<Response<Student[]>> =
        await axiosInstance.post("/students/assign-class", {
          classId,
          studentId: studentIds,
        });
      return response.data;
    } catch (error: any) {
      throw new Error("Lỗi khi gán sinh viên vào lớp: " + error.message);
    }
  }
}

export const studentService = new StudentService();
